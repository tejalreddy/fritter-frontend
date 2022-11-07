/* eslint-disable @typescript-eslint/indent */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import InsightsCollection from './collection';

/**
 * Checks to make sure date is in the correct YYYY-MM-DD format
 */
const isDateValid = async (req: Request, res: Response, next: NextFunction) => {
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$/;
    if (!dateRegex.test(req.params.date)) {
        res.status(400).json({
            error: {
                invalidFormat: 'Date is not in the correct YYYY-MM-DD format.'
            }
        });
        return;
    }

    next();
};

/**
 * Check to make sure that total time is in valid format
 */
 const isValidTimeFormat = async (req: Request, res: Response, next: NextFunction) => {
    const timeRegex = /^[0-9]+$/;
    if (!timeRegex.test(req.body.totalTime)) {
        res.status(400).json({
        error: {
            username: 'Time must be in valid format.'
        }
        });
        return;
    }

    next();
};

/**
 * Checks to make sure the selected date exists in a user's insights
 */
const isDateExist = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const [month, day, year] = req.params.date.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    const insight = await InsightsCollection.findByDate(userId, date);
    if (!insight) {
        res.status(404).json({
            error: {
                noInsightFound: `No insights found for ${req.params.date}`
            }
        });
        return;
    }

    next();
};

export {
    isDateValid,
    isDateExist,
    isValidTimeFormat
};
