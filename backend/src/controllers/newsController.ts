import { Request, Response } from "express";
import { News } from '../types/type';
import { getNews, getNewsByTitle, createNews, deleteNewsById, updateNewsById } from '../models/news';

// Retrieve all news
export const retrieveAllNews = async ( req: Request, res: Response ) => {
    try {
        const allNews: News[] = await getNews();

        // If no news found, log message
        if (allNews.length === 0) {
            console.log("No news found.");
            return;
        }
        // return news json
        res.status(200).json(allNews);
        return allNews;
    
    // Return error if retrieve all news fail
    } catch (error) {
        console.log("Retrieve all news failed.", error);
        res.sendStatus(400);
        return;
    }
} 

// Delete news
export const deleteNews = async ( req: Request, res: Response ) => {
    try {
        // Retrieve id from request then call delete news function
        const { id } = req.params;
        const deleteNews = await deleteNewsById(id);

        // If no news found to delete, log message
        if (!deleteNews) {
            console.log("Not found news to delete.")
            res.sendStatus(400);
            return;
        }
        
        // Send json to noti news is delete
        console.log("News deleted successfully.", deleteNews)
        res.sendStatus(200);
        return;
        
    // Return error if delete news fail
    } catch (error) {
        console.log("Delete news failed.", error);
        res.sendStatus(400);
        return;
    }
}

// Search news by title
export const searchNews = async ( req: Request, res: Response ) => {
    try {
        // get title
        const { title } = req.body.title;

        // Return 400 if title is not exist
        if (!title){
            console.log("Not found news title.")
            res.sendStatus(400);
            return;
        }

        // return news by title
        const result = await getNewsByTitle(title);

        // Return 400 if result is not exist
        if (!result){
            console.log("Not found news.")
            res.sendStatus(400);
            return;
        }

        // return result json
        console.log("Found news.")
        res.status(200).json(result);
        return result;
    
    // Return error if search fail
    } catch (error) {
        console.log("Search news by title failed.", error);
        res.sendStatus(400);
        return;
    }
}

// Update news
export const updateNews = async ( req: Request, res: Response ) => {
    try {
        // Get value and id
        const { id } = req.params;
        const { title } = req.body.title;
        const { content } = req.body.content;
        const { tags } = req.body.tags;
        
        // If value is not exist send status 400
        if (!id) {
            console.log("News id is not exist.");
            res.sendStatus(400);
            return;
        }
        
        // Update news
        const updateNews = await updateNewsById(id, { title, content, tags });

        // If news does not update send status 400
        if (!updateNews) {
            console.log("Update news failed.");
            res.sendStatus(400);
            return;
        }

        // return updated news
        console.log("Update news successfully.");
        res.status(200).json(updateNews);
        return;

    // Return error if update news fail
    } catch (error) {
        console.log("Update news failed.", error);
        res.sendStatus(400);
        return;
    }
  };

// Create news
export const makeNews = async ( req: Request, res: Response ) => {
    try {
        // Get value
        const { title } = req.body.title;
        const { content } = req.body.content;
        const { tags } = req.body.tags;
        
        // If value is not exist send status 400
        if (!title && !content && !tags) {
            console.log("News value is not exist.");
            res.sendStatus(400);
            return;
        }
        
        // Create news
        const makeNews = await createNews(title, content, tags);
        
        // return created news
        console.log("Create news successfully.");
        res.status(200).json(makeNews);
        return;

    // Return error if create news fail
    } catch (error) {
        console.log("Create news failed.", error);
        res.sendStatus(400);
        return;
    }
};
