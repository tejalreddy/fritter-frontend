/* eslint-disable capitalized-comments */
/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type {Insights} from './model';
import InsightsModel from './model';

/**
 * Contains the functionality to explore the Insights stored in MongoDB
 */
class InsightsCollection {
    /**
     * Upsert an Insight log
     *
     * @param {string} userId the user id
     * @param {number} totalTime the total time the user was on the platform
     * @returns {Promise<Array<HydratedDocument<Insights>>>} all of the logs upserted
     */
    static async upsertOne(userId: Types.ObjectId | string, totalTime: number): Promise<Array<HydratedDocument<Insights>>> {
        const currentTime = new Date();

        const insightLog = await InsightsModel.find({userId, date: currentTime.toLocaleString().split(',')[0]}).sort({_id: -1}).limit(1);
        const logsUpserted = [];

        if (insightLog.length > 0) {
            const recentLog = insightLog[0];
            recentLog.totalTime += totalTime;
            await recentLog.save();
            logsUpserted.push(recentLog);
        } else {
            const insights = new InsightsModel({userId, date: currentTime.toLocaleString().split(',')[0], totalTime});
            await insights.save();
            logsUpserted.push(insights);
        }
        
        return logsUpserted;
    }

    /**
     * Get information for a particulr day
     *
     * @param {string} userId - the user id
     * @param {Date} date - the date to find the insight for
     * @returns {Promise<HydratedDocument<Insights>>} the insight for the selected date
     */
    static async findByDate(userId: Types.ObjectId | string, date: Date): Promise<HydratedDocument<Insights>> {
        const insights = await InsightsModel.findOne({userId, date: date.toLocaleString().split(',')[0]});
        return insights;
    }

    /**
     * Get all the insights for a particular user
     *
     * @param userId the user id
     * @returns {Promise<Array<HydratedDocument<Insights>>>} all of the insights for a user
     */
    static async findByuserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Insights>>> {
        const insights = await InsightsModel.find({userId});
        return insights;
    }
}

export default InsightsCollection;
