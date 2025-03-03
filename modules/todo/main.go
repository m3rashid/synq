package todo

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

var todos []Todo = []Todo{
	{1, "Learn Go", "Learn Go programming language"},
	{2, "Learn Fiber", "Learn Fiber web framework"},
	{3, "Build a RESTful API", "Build a RESTful API using Go and Fiber"},
	{4, "Build a Todo App", "Build a Todo App using Go and Fiber"},
	{5, "Build a Blog App", "Build a Blog App using Go and Fiber"},
	{6, "Build a Chat App", "Build a Chat App using Go and Fiber"},
	{7, "Build a E-commerce App", "Build a E-commerce App using Go and Fiber"},
	{8, "Build a Social Media App", "Build a Social Media App using Go and Fiber"},
	{9, "Build a Realtime App", "Build a Realtime App using Go and Fiber"},
	{10, "Build a Websocket App", "Build a Websocket App using Go and Fiber"},
}

func Setup(router fiber.Router) {
	router.Get("/", func(c *fiber.Ctx) error {
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
}
