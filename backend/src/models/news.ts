import { Schema, model } from "mongoose";
import { News } from '../types/type';
import { Types } from "mongoose";


// Create newsSchema
const newsSchema = new Schema<News>({
     _id: Types.ObjectId,

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },

    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },

    // Array string of tags
    tags: {
        type: [String],
        required: true
    }
},
{
    // add createdAt and updateAt to schema
    timestamps: true
});

export const NewsModel = model<News>('News', newsSchema);

// Get all news
export const getNews = () => NewsModel.find().lean();
// Get news by title
export const getNewsByTitle = ( title: string ) => NewsModel.findOne({ title });
// Create news
export const createNews = ( value: News ) => new NewsModel(value).save().then((news) => news.toObject());
// Delete news by id
export const deleteNewsById = ( id: string ) => NewsModel.findByIdAndDelete({ _id: id});
// Update news by id
export const updateNewsById = ( id: string, value: News ) => NewsModel.findByIdAndUpdate({ _id: id, value});
