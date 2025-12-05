import path from "node:path"
import fs from "node:fs"
import morgan from "morgan"

const _dirname = path.resolve()

export function attachRouterWithLogger(app , routerPath , router , logFileName){
    const logStream = fs.createWriteStream(path.join(_dirname , "./src/Logs" , logFileName),
    {flags :"a"}
)

    app.use(routerPath,morgan("combined",{stream : logStream}),router);
    app.use(routerPath,morgan("dev"),router);
}

