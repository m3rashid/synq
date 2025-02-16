package utils

import (
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

type PublicFolderConfig struct {
	Path   string
	Config fiber.Static
}

type Server struct {
	ExecDir            string
	AppConfig          fiber.Config
	CorsConfig         cors.Config
	FaviconConfig      favicon.Config
	RateLimitConfig    limiter.Config
	PublicFolderConfig PublicFolderConfig
}

func NewServer() (Server, error) {
	exePath, err := os.Executable()
	if err != nil {
		return Server{}, err
	}
	exeDir := filepath.Dir(exePath)

	return Server{
		ExecDir:            exeDir,
		AppConfig:          getFiberConfig(),
		CorsConfig:         getCorsConfig(),
		FaviconConfig:      getFaviconConfig(exeDir),
		RateLimitConfig:    getRateLimitConfig(),
		PublicFolderConfig: getPublicConfig(exeDir),
	}, nil
}

func getFiberConfig() fiber.Config {
	return fiber.Config{
		CaseSensitive:         true,
		PassLocalsToViews:     true,
		AppName:               Env.AppName,
		RequestMethods:        []string{"GET", "POST", "HEAD", "OPTIONS"},
		Concurrency:           256 * 1024 * 1024,
		ServerHeader:          Env.AppName,
		DisableStartupMessage: true,
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.Status(code).JSON(fiber.Map{
				"data":    nil,
				"success": false,
				"message": Ternary(Env.IsProduction, "Something went wrong!", err.Error()),
			})
		},
	}
}

func getCorsConfig() cors.Config {
	return cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000",
	}
}

func getFaviconConfig(exeDir string) favicon.Config {
	return favicon.Config{
		URL:  "/favicon.ico",
		File: Ternary(Env.IsProduction, filepath.Join(exeDir, "client/dist/vite.svg"), "./client/dist/vite.svg"),
	}
}

func getRateLimitConfig() limiter.Config {
	return limiter.Config{
		Max:               100,
		Expiration:        1 * time.Minute,
		LimiterMiddleware: limiter.SlidingWindow{},
	}
}

func getPublicConfig(exeDir string) PublicFolderConfig {
	return PublicFolderConfig{
		Path:   Ternary(Env.IsProduction, filepath.Join(exeDir, "client/dist"), "./client/dist"),
		Config: fiber.Static{MaxAge: 3600, CacheDuration: 10 * time.Second},
	}
}
