# App Gamification API

The **Gamification API** is a powerful tool for developers to integrate gamification features like player points, achievements, and progress tracking into their applications. Whether you're building a game, educational app, or fitness tracker, this API simplifies the process of managing player engagement and rewards.

---

## Key Features

- **Player Points Management**: Add, subtract, or retrieve player points with ease.
- **Achievements System**: Track and manage player achievements, including unlocking rewards and milestones.
- **Web Portal Integration**: Create, update, and analyze achievements via an intuitive web portal.
- **Player Progress Tracking**: Monitor player progress and display completed achievements dynamically.

---

## Why Use This API?

- **Streamlined Achievement System**: Pre-built methods for tracking, retrieving, and updating player points and achievements.
- **Flexibility**: Achievements can represent levels, goals, challenges, or any milestones you define.
- **Player Engagement**: Enhance user experience by rewarding achievements and displaying progress.
- **Simplified Development**: Clear endpoints and intuitive functions make integration quick and easy.

---

## Getting Started

### Authentication
All requests to the API require an `appID` and `api_key` in the request headers for authentication.

### Error Handling
The API returns the following error codes:
- **400 Bad Request**: Invalid request parameters, missing required fields, or invalid data.
- **403 Forbidden**: Invalid `appID` or `api_key`, or the API key has expired.
- **404 Not Found**: The requested resource (player, achievement, etc.) was not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.

---

## API Models

### PlayerSchema
| Field            | Type                              | Description                                      |
|------------------|-----------------------------------|--------------------------------------------------|
| `appID`          | `mongoose.Schema.Types.ObjectId`  | The unique ID of the app.                        |
| `playerID`       | `String`                          | The unique ID of the player.                     |
| `username`       | `String`                          | The player's username.                           |
| `playerPoints`   | `Number`                          | The player's current points.                     |
| `achievementIds` | `Array of mongoose.Schema.Types.ObjectId` | IDs of achievements completed by the player. |

### AchievementSchema
| Field               | Type                              | Description                                      |
|---------------------|-----------------------------------|--------------------------------------------------|
| `appID`             | `mongoose.Schema.Types.ObjectId`  | The unique ID of the app.                        |
| `achievementID`     | `mongoose.Schema.Types.ObjectId`  | The unique ID of the achievement.                |
| `title`             | `String`                          | The title of the achievement.                    |
| `pointsNeeded`      | `Number`                          | Points required to earn the achievement.         |
| `playerIdsAchieved` | `Array of Strings`                | IDs of players who have earned this achievement. |

### AppSchema
| Field            | Type                              | Description                                      |
|------------------|-----------------------------------|--------------------------------------------------|
| `appID`          | `mongoose.Schema.Types.ObjectId`  | The unique ID of the app.                        |
| `appName`        | `String`                          | The name of the app.                             |
| `players`        | `Array of Strings`                | IDs of players associated with the app.          |
| `achievements`   | `Array of mongoose.Schema.Types.ObjectId` | IDs of achievements associated with the app. |

---

## API Endpoints

### Players
| Method | Endpoint                                      | Description                                      |
|--------|-----------------------------------------------|--------------------------------------------------|
| GET    | `/players/:appID`                             | Get all players for a specific app.              |
| GET    | `/players/:appID/player=:playerID`            | Get a specific player by ID.                     |
| GET    | `/players/:appID/top`                         | Get top players (sorted by points).              |
| GET    | `/players/:appID/player=:playerID/rank`       | Get a player's rank.                             |
| POST   | `/players/:appID/player=:playerID/points/add` | Increment a player's points.                     |
| POST   | `/players/:appID/player=:playerID/points/reduce` | Decrement a player's points.                  |
| PUT    | `/players/:appID/player=:playerID/points/set` | Set a player's points to a specific value.       |
| POST   | `/players/:appID/create/player=:playerID`     | Create a new player.                             |
| DELETE | `/players/:appID/delete/player=:playerID`     | Delete a player.                                 |
| PUT    | `/players/:appID/player=:playerID/username/set` | Set a player's username.                      |

### Achievements
| Method | Endpoint                                      | Description                                      |
|--------|-----------------------------------------------|--------------------------------------------------|
| GET    | `/achievements/:appID`                        | Get all achievements for a specific app.         |
| GET    | `/achievements/:appID/points=:points`         | Get an achievement by required points.           |
| GET    | `/achievements/:appID/title=:title`           | Get an achievement by title.                     |
| GET    | `/achievements/:appID/player=:playerID/done`  | Get achievements completed by a player.          |
| GET    | `/achievements/:appID/player=:playerID/todo`  | Get achievements not yet completed by a player.  |
| GET    | `/achievements/:appID/player=:playerID/check/:achievementID` | Check if a player has completed an achievement. |
| PUT    | `/achievements/:appID/player=:playerID/achievement=:achievementID/add` | Add an achievement to a player. |
| PUT    | `/achievements/:appID/player=:playerID/achievement=:achievementID/remove` | Remove an achievement from a player. |

---

## Android SDK
Integrate gamification features into your Android apps using the provided SDK. It includes built-in UI components for managing player points, achievements, leaderboards, and ranks.

[Learn more about the Android SDK](https://github.com/Itay-Biton/AndroidGamificationSDK)

---

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Contact

If you have any questions or need assistance, feel free to reach out to me at [itaybit10@gmail.com](mailto:itaybit10@gmail.com).

---

## Note to Recruiters

Please note that this SDK is part of my professional portfolio. If you’re interested in my work or would like to discuss potential job opportunities, feel free to reach out via the provided email. I am open to exploring new projects and opportunities.
