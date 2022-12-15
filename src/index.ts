import { AppDataSource } from "./data-source"
import app from "./server"

AppDataSource.initialize().then(async () => {
    // await AppDataSource.runMigrations()

    app.listen(3000, () => console.log('Listening'))
}).catch(error => console.log(error))
