import { Card } from "../enum/cards/Card";
import { Edition } from "../enum/Edition";
import { Seal } from "../enum/Seal";

const sealNamesZh: Record<string, string> = {
    "Red Seal": "红色蜡封",
    "Blue Seal": "蓝色蜡封",
    "Gold Seal": "金色蜡封",
    "Purple Seal": "紫色蜡封",
};

const editionNamesZh: Record<string, string> = {
    "Foil": "闪箔",
    "Holographic": "镭射",
    "Polychrome": "多彩",
    "Negative": "负片",
    "Eternal": "永恒",
    "Perishable": "易腐",
    "Rental": "租用",
};

const enhancementNamesZh: Record<string, string> = {
    "Bonus": "奖励牌",
    "Mult": "倍率牌",
    "Wild": "万能牌",
    "Glass": "玻璃牌",
    "Steel": "钢铁牌",
    "Stone": "石头牌",
    "Gold": "黄金牌",
    "Lucky": "幸运牌",
};

const suitMapZh: Record<string, string> = {
    'H': '红桃',
    'S': '黑桃',
    'D': '方片',
    'C': '梅花',
};

export class CardNameBuilder {
    seal: string;
    edition: string;
    enhancement: string;
    constructor(
        private card: Card
    ) {
        this.seal = this.card.getSeal()?.getName() || Seal.NO_SEAL;
        this.edition = this.card.getEdition()?.getName() || Edition.NO_EDITION;
        this.enhancement = this.card.getEnhancement() || "No Enhancement";
    }

    build(): string {
        let result = '';
        if (this.seal !== Seal.NO_SEAL) {
            result += `${sealNamesZh[this.seal] || this.seal} `;
        }
        if (this.edition !== Edition.NO_EDITION) {
            result += `${editionNamesZh[this.edition] || this.edition} `;
        }
        if (this.enhancement !== "No Enhancement") {
            result += `${enhancementNamesZh[this.enhancement] || this.enhancement} `
        }

        const rank = this.card.getName().charAt(2);

        switch (rank) {
            case 'T':
                result += '10';
                break;
            case 'J':
                result += 'J';
                break;
            case 'Q':
                result += 'Q';
                break;
            case 'K':
                result += 'K';
                break;
            case 'A':
                result += 'A';
                break;
            default:
                result += rank;
        }

        const suit = this.card.getName().charAt(0);
        const suitZh = suitMapZh[suit] || '';

        return `${suitZh}${result}`;
    }

}