package utils

type ServerMode string

const (
	Development ServerMode = "development"
	Production  ServerMode = "production"
)

type Environment struct {
	Port         int
	AppName      string
	ServerMode   ServerMode
	IsProduction bool
}

// func getEnv[T ~int | string](key string, defaultValue ...string) T {
// 	value := os.Getenv(key)
// 	if value == "" && len(defaultValue) > 0 {
// 		// return defaultValue[0]
// 	}
// 	// type case into T and return
// 	// return value
// }

var Env Environment

func SetupEnv() {
	// err := godotenv.Load(".env.local")
	// if err != nil {
	// 	fmt.Println("Error loading .env file", err)
	// }

	Env = Environment{
		Port:         4000,
		AppName:      "Synq",
		ServerMode:   Development,
		IsProduction: false,
	}
}
