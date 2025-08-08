import express from "express";
import { News } from '../types/type';
import { getNews, getNewsByTitle, createNews, deleteNewsById, updateNewsById } from '../models/news';

const req = express.request;
const res = express.response;

// Retrieve all news
export const retrieveAllNews = async () => {
    try {
        const allNews: News[] = await getNews();
        // return news json
        res.status(200).json(allNews);
        return;
    
    // Return error if retrieve all news fail
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
} 

// Delete news
export const deleteNews = async () => {
    try {
        // Retrieve id from request then call delete news function
        const { id } = req.params;
        const deleteNews = await deleteNewsById(id);
        
        // Send json to noti news is delete
        res.json(deleteNews);
        return;
        
    // Return error if delete news fail
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

// Search news by title
export const searchNews = async () => {
    try {
        // get title
        const { title } = req.body;

        // Return 400 if title is not exist
        if (!title){
            res.sendStatus(400);
            return;
        }

        // return news by title
        const result = await getNewsByTitle(title);

        // Return 400 if result is not exist
        if (!result){
            res.sendStatus(400);
            return;
        }

        // return result json
        res.status(200).json(result);
        return;
    
    // Return error if search fail
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

// Update news
export const updateNews = async (  ) => {
    try {
        // Get value and id
        const { value } = req.body;
        const { id } = req.params;
        
        // If value is not exist send status 400
        if (!value) {
            res.sendStatus(400);
            return;
        }
        
        // Update news
        const updateNews = await updateNewsById(id, value);

        // If news does not update send status 400
        if (!updateNews) {
            res.sendStatus(400);
            return;
        }

        // return updated news
        res.status(200).json(updateNews);
        return;

    // Return error if update news fail
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
      return;
    }
  };

// Create news
  export const makeNews = async (  ) => {
    try {
        // Get value
        const { value } = req.body;
        
        // If value is not exist send status 400
        if (!value) {
            res.sendStatus(400);
            return;
        }
        
        // Create news
        const makeNews = await createNews(value);

        // return created news
        res.status(200).json(makeNews);
        return;

    // Return error if create news fail
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
      return;
    }
  };
