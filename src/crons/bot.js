import { helpers } from "sc-common";
import { Table } from "sc-game-base";
import constants from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository, appConfigs) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.appConfigs = appConfigs;
        this.betChoiceRatio = { HomeAway: 70, Draw: 2 };
        this.drawOpts = ["draw"];

        this.homeAwayOpts = ["home", "away"];
        this.hedgeBetGroups = [this.homeAwayOpts];
        this.smallTicketRatio = 70;
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            home: 0,
            away: 0,
            draw: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.homeAwayOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.homeAwayOpts) * 100) / totalBotBet < this.betChoiceRatio.HomeAway,
            },
            {
                group: this.drawOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.drawOpts) * 100) / totalBotBet < this.betChoiceRatio.Draw,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0 ? this.chance.pickone(underRatioGroups[0].group) : this.chance.pickone(this.homeAwayOpts);

        const hedgeBetGroup = this.hedgeBetGroups.find((group) => group.includes(choice));
        if (hedgeBetGroup) {
            const oppositeChoice = choice === hedgeBetGroup[0] ? hedgeBetGroup[1] : hedgeBetGroup[0];
            return bot.choices.includes(oppositeChoice) ? oppositeChoice : choice;
        } else {
            return choice;
        }
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        const maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.homeAwayOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3);
            return isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.min(minBet * 10, maxBet * 0.2);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += amount <= this.getMinBet() * 50 ? 1 : 0;
    }

    convertAmountToChip(amount) {
        const chipList = constants.botChips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }

    getBotsToBet() {
        const maxTickets = Math.floor(Object.keys(this.botsInRoom).length / this.gameData.remainingTime) + 5;
        const numberBotsToBet = this.chance.integer({ min: 5, max: maxTickets });

        let botsToBet = Object.values(this.botsInRoom).filter(
            (t) => t.totalBet < this.gameData.gameConfigs.bot_maxbet && t.remainTickets > 0
        );

        botsToBet = this.chance.shuffle(botsToBet);

        return botsToBet.slice(0, Math.min(numberBotsToBet, botsToBet.length));
    }

    shouldAddBot(random) {
        return random === this.inOutValues.in && Object.keys(this.botsInRoom).length < this.maxNumberOfBots;
    }
}
