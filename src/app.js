const express = require("express");
const app = express();
const  mongoose = require("mongoose");
const cors= require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());


const mongoUri = process.env.MONGODB_URI;

try {
    mongoose.connect(mongoUri);
    console.log('connected to mongo');
} catch (error) {
    console.error("error connecting to mongo",error);
}

    const libroSchema = new mongoose.Schema ({
    titulo: String,
    autor: String
    });

const Libro = mongoose.model("Libro", libroSchema);
//crear libro schema
app.post("/libro", async (req, res) => {
    const libro = new Libro({
        titulo: req.body.titulo,
         autor: req.body.autor
    })
    try {
        await libro.save();
        res.json(libro);
    } catch (error) {
        console.error("error save book");
    }
})
//ver libros creados
    app.get("/libro",async (req, res)=>{
        try {
            const libros = await Libro.find();
            res.json(libros);
        } catch (error) {
            console.status(500).send("error get books");
        }
    });
    //buscar libro
    app.get("/libro/:id", async (req, res) => {
        try {
          const libro = await Libro.findById(req.params.id);
          if (libro) {
            res.json(libro);
          } else {
            res.status(404).send("Libro no encontrado");
          }
        } catch (error) {
          res.status(500).send("Error al buscar el libro");
        }
      });

//actualizar libro
app.put("/libro/:id", async (req, res) => {
    try {
      const libro = await Libro.findByIdAndUpdate(
        req.params.id,
        {
          titulo: req.body.titulo,
          autor: req.body.autor,
        },
        { new: true } 
      );

      if (libro) {
        res.json(libro);
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al actualizar el libro");
    }
  });
  //eliminar libro
  app.delete("/libro/:id", async (req, res) => {
    try {
        const libro = await Libro.findOneAndDelete({ _id: req.params.id });
        if (libro) {
            res.status(204).send();
        } else {
            res.status(404).send("Libro no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el libro");
    }
});

module.exports =app;
