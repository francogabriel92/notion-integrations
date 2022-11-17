"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dolarUpdate = void 0;
const index_1 = __importDefault(require("../../node_modules/axios/index"));
const constants_js_1 = require("../constants/constants.js");
const config_1 = require("../config");
const getDolarValue = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield index_1.default.get(constants_js_1.DOLAR_API_URL);
    const data = response.data;
    const processedData = data.map((el) => {
        return {
            name: el.casa.nombre.toLowerCase(),
            buy: parseFloat(el.casa.compra),
            sell: parseFloat(el.casa.venta)
        };
    });
    return processedData;
});
const getPages = (key, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield index_1.default.post(`${constants_js_1.NOTION_URL}/databases/${id}/query`, {}, {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Notion-Version': '2022-06-28',
            'Authorization': `Bearer ${key}`,
        }
    });
    const data = response.data.results;
    const pages = data.map((el) => {
        return {
            id: el.id,
            name: el.properties.Name.title[0].plain_text.toLowerCase(),
            buy: el.properties.Buy.number,
            sell: el.properties.Sell.number
        };
    });
    return pages;
});
const dolarUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
    const dolars = yield getDolarValue();
    const pages = yield getPages(config_1.NOTION_KEY, config_1.DATABASE_ID);
    yield Promise.all(yield dolars.map((d) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(typeof (d.sell));
        const { name, buy, sell } = d;
        const page = pages.filter(p => p.name === name)[0];
        if (!page)
            return;
        const payload = {
            properties: {
                Sell: {
                    number: sell,
                },
                Buy: {
                    number: buy
                },
            },
        };
        console.log(typeof (payload.properties.Sell.number));
        const response = yield index_1.default.patch(`${constants_js_1.NOTION_URL}/pages/${page.id}`, payload, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Notion-Version': '2022-06-28',
                'Authorization': `Bearer ${config_1.NOTION_KEY}`,
            },
        });
        return response.status;
    })));
});
exports.dolarUpdate = dolarUpdate;
