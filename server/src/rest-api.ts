import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();
import { db } from "./db/knex";
import { UrlObject, UrlReturnType } from "./db/types/Url";

//middleware
app.use(cors());
app.use(express.json());

app.get("/", async (_req, res) =>
{
  res.json({ hello: "world", "client-default-port": 3000 });
});

app.post("/compress-url", async (req, res) =>
{
  const { url, expiration_date } = req.body;
  const slug = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
  const shortenedUrl = `${process.env.BASE_URL || "http://localhost:8000"}/${slug}`;

  const tableData: UrlObject = {
    redirect_url: url,
    shortened_url: shortenedUrl,
    slug: slug,
    expiration_date: expiration_date
  }

  const [doc] = await db("urls")
    .insert(tableData)
    .returning("*");

  res.json(doc);
});

app.get("/:slug", async (req, res) =>
{
  const { slug } = req.params;

  const urlEntry = await db("urls")
    .where({ slug: slug })
    .first() as UrlReturnType;

  res.redirect(urlEntry.redirect_url)
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
{
  console.log(`server has started on port ${PORT}`);
});
