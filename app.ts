import express, { type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import type { Tarea } from "./types/tareaTypes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.port;

app.use(express.json());


// bd simulada

let tareas: Tarea[] = [];
let idActual = 0;


app.get("/tareas", (req: Request, res: Response) => {
    res.json(tareas);
})

app.get("/tareas/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400);
        throw new Error("ID no es un número válido");
    }

    const tarea = tareas.find((t) => t.id === id);

    if (!tarea) {
        res.status(404).json({
            error: "Tarea no encontrada"
        });
        return;
    }

    res.json(tarea);
});

app.post("/tareas", (req: Request, res: Response) => {
    const { titulo } = req.body;

    if (!titulo || typeof titulo !== "string") {
        res.status(400).json({
            error: "Título es requerido"
        });
        return;
    }

    const nuevaTarea: Tarea = {
        id: ++idActual,
        titulo,
        completada: false
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

app.put("/tareas/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    let { completada } = req.body;

    completada = completada == "True" ? true : completada == "False" ? false : undefined;

    if (typeof completada !== "boolean") {
        res.status(400).json({
            error: "Completada debe ser un booleano"
        });
        return;
    }

    if (isNaN(id)) {
        res.status(400).json({
            error: "ID no es un número válido"
        });
        return;
    }

    const tarea = tareas.find((t) => t.id === id);

    if (!tarea) {
        res.status(404).json({
            error: "Tarea no encontrada"
        });
        return;
    }

    tarea.completada = completada;

    res.json(tarea);
})

app.delete("/tareas/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            error: "ID no es un número válido"
        });
        return;
    }

    const tarea = tareas.find((t) => t.id === id);

    if (!tarea) {
        res.status(404).json({
            error: "Tarea no encontrada"
        });
        return;
    }

    tareas = tareas.filter((t) => t.id !== id);

    res.json(tarea);
})


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Error interno del servidor"
    });
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

