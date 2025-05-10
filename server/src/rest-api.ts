import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();
import { db } from "./db/knex";
import { UrlObject, UrlReturnType } from "../types/Url";

//middleware
app.use(cors());
app.use(express.json());

app.get("/", async (_req, res) =>
{
  const table = await db("urls");
  res.json(table)
  // res.json({ hello: "world", "client-default-port": 3000 });
});


app.get("/slug-exists/:slug", async (req, res) =>
{
  try 
  {
    const { slug } = req.params;

    const slugExists = await db("urls")
      .where({ slug: slug })
      .first();

    res.json({ slug_exists: !!slugExists })
  }
  catch (error)
  {
    console.error("Error checking slug existence:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/compress-url", async (req, res) =>
{
  try
  {
    const { url, custom_slug, expiration_date } = req.body;

    let slug = custom_slug || crypto.randomUUID().replace(/-/g, '').substring(0, 8);
    let exists = true;

    // Keep generating a new slug until its unique
    while (exists)
    {
      const existingEntry = await db("urls").where({ slug }).first();
      exists = !!existingEntry;

      // Generate a new slug
      if (exists)
        slug = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
    }

    const shortenedUrl = `${process.env.BASE_URL || "http://localhost:8000"}/${slug}`;

    const tableData: UrlObject = {
      redirect_url: url,
      shortened_url: shortenedUrl,
      slug: custom_slug || slug,
      expiration_date: expiration_date
    }

    const [doc] = await db("urls")
      .insert(tableData)
      .returning("*");

    res.json(doc);
  }
  catch (error)
  {
    console.error("Error compressing URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:slug", async (req, res) =>
{
  try 
  {
    const { slug } = req.params;

    const urlEntry = await db("urls")
      .where({ slug: slug })
      .first() as UrlReturnType;

    // Slug not found
    if (!urlEntry)
      return res.redirect(`${process.env.CLIENT_BASE_URL || "http://localhost:3000"}/not-found`);

    // Slug expired
    if (!!urlEntry.expiration_date && new Date(urlEntry.expiration_date) < new Date())
      return res.redirect(`${process.env.CLIENT_BASE_URL || "http://localhost:3000"}/expired`);



    res.redirect(urlEntry.redirect_url);
  }
  catch (error)
  {
    console.error("Error fetching slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
{
  console.log(`server has started on port ${PORT}`);
});
