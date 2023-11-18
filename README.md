# Backend-simulation-of-file-hosting
This project has an implementation of users, roles and files, this because we are triying to simulate a file hosting and synchronization

.
├── .env
├── .env.example
├── .gitignore
├── combined.log
├── error.log
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── dist
│   └── index.js
├── src
│   ├── index.ts
│   ├── api
│   │   ├── controllers
│   │   │   ├── apiRoutes.ts
│   │   │   ├── authController.ts
│   │   │   ├── roleController.ts
│   │   │   ├── userController.ts
│   │   │   └── fileController.ts        // Añadido para manejar las operaciones de archivos
│   │   └── middleware
│   │       └── verifyToken.ts
│   ├── app
│   │   ├── dtos
│   │   │   ├── create.role.dto.ts
│   │   │   ├── create.user.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   ├── user.dto.ts
│   │   │   └── file.dto.ts             // Añadido para transferencia de datos de archivos
│   │   ├── services
│   │   │   ├── authService.ts
│   │   │   ├── roleService.ts
│   │   │   ├── userService.ts
│   │   │   └── fileService.ts          // Añadido para la lógica de negocio de archivos
│   │   └── utils
│   │       └── encrypt.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── IRoleEntity.ts
│   │   │   ├── IUserEntity.ts
│   │   │   └── IFileEntity.ts          // Añadido para representar la entidad de archivo
│   │   ├── interfaces
│   │   │   ├── IRedisCache.ts
│   │   │   ├── roleRepository.ts
│   │   │   ├── userRepository.ts
│   │   │   └── fileStoragePort.ts      // Añadido para operaciones de almacenamiento de archivos
│   │   └── models
│   │       ├── role.ts
│   │       ├── user.ts
│   │       └── file.ts                 // Añadido para el modelo de archivo
│   ├── infrastructure
│   │   ├── cache
│   │   │   └── redis.cache.ts
│   │   ├── config
│   │   │   ├── config.ts
│   │   │   └── dataSource.ts
│   │   ├── entities
│   │   │   ├── roleEntity.ts
│   │   │   ├── userEntity.ts
│   │   │   └── fileEntity.ts           // Añadido para la entidad de archivo de la base de datos
│   │   ├── logger
│   │   │   └── logger.ts
│   │   ├── repositories
│   │   │   ├── roleRepositoryImpl.ts
│   │   │   ├── userRepositoryImpl.ts
│   │   │   └── fileRepositoryImpl.ts   // Añadido para la implementación del repositorio de archivos
│   │   └── utils
│   │       └── encrypt.jwt.ts
│   └── types
│       └── express.d.ts
└── tree.txt
