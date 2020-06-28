import { Request, Response } from "express";

export default async (req: Request, resp: Response) => {
  resp.render("landing/index", {
    title: 'Penentuan Gizi Buruk Pada Balita'
  });
}