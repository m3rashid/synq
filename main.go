package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/m3rashid/synq/modules/todo"
	"github.com/m3rashid/synq/modules/user"
	"github.com/m3rashid/synq/utils"
)

func init() {
	isTestEnvironment := strings.HasSuffix(os.Args[0], ".test")
	if isTestEnvironment { // we are in a testing environment
		return
	}

	utils.SetupEnv()
}

func main() {
	server, err := utils.NewServer()
	if err != nil {
		log.Fatal(err)
	}

	app := fiber.New(server.AppConfig)
	app.Use(recover.New())
	app.Use(cors.New(server.CorsConfig))
	app.Static("/", server.PublicFolderConfig.Path, server.PublicFolderConfig.Config)
	app.Use(favicon.New(server.FaviconConfig))
	app.Use(limiter.New(server.RateLimitConfig))
	app.Use(logger.New())

	app.Get("/api", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello, World!")
	})

	todo.Setup(app.Group("/api/todos"))
	user.Setup(app.Group("/api/users"))

	log.Println("Server is running in "+utils.Env.ServerMode+" mode on port:", utils.Env.Port)
	app.Listen(fmt.Sprintf(":%d", utils.Env.Port))
}
