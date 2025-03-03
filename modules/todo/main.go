package todo

import (
	"strconv"

	"slices"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func generateFakeTodos(count int) []Todo {
	todos := make([]Todo, count)
	for i := range count {
		todos[i] = Todo{
			Id:          i + 1,
			Title:       gofakeit.Quote(),
			Description: gofakeit.Sentence(20),
		}
	}
	return todos
}

var todos []Todo = generateFakeTodos(8)

func Setup(router fiber.Router) {
	router.Get("/", func(c *fiber.Ctx) error {
		if len(todos) == 0 {
			todos = generateFakeTodos(8)
		}
		return c.JSON(todos)
	})

	router.Get("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		id_int, err := strconv.Atoi(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
		}

		var todo Todo
		for _, t := range todos {
			if t.Id == id_int {
				todo = t
				break
			}
		}

		if todo.Id == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Todo not found"})
		}

		return c.JSON(todo)
	})

	router.Post("/", func(c *fiber.Ctx) error {
		var body Todo
		err := c.BodyParser(&body)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		todo := Todo{
			Id:          len(todos) + 1,
			Title:       body.Title,
			Description: body.Description,
		}

		todos = append(todos, todo)
		return c.JSON(fiber.Map{"id": todo.Id})
	})

	router.Post("/delete/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		id_int, err := strconv.Atoi(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
		}

		found := false
		for i, t := range todos {
			if t.Id == id_int {
				todos = slices.Delete(todos, i, i+1)
				found = true
				break
			}
		}

		if !found {
			return c.SendStatus(fiber.StatusNotFound)
		}

		return c.JSON(fiber.Map{"message": "Todo deleted successfully"})
	})
}
