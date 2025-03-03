package user

import "github.com/gofiber/fiber/v2"

func Setup(router fiber.Router) {
	router.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello, World!")
	})
}
