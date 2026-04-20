import { TrafficTracker } from "../TrafficTracker.ts";
import { zen2han } from "./common.ts";

export type TyphReportListItem = {
	controlTitle: string;
	datetime: string;
	editorialOffice: string;
	publishingOffice: string;
	headTitle: string;
	reportDateTime: string;
	targetDateTime: string;
	eventId: string;
	infoType: "発表";
	serial: string;
	fileName: string;
	header: string;
};

export type TcCodeListItem = {
	tropicalCyclone: string;
	typhoonNumber: string;
	category: string;
	issue: string;
};

type TyphCommentEntry = {
	lastUpdated: number;
	comment: string;
	number: number;
};

export type TyphCommentOperator = {
	url_info: string;
	url_typh: string;
	data: Record<string, TyphCommentEntry>;
	onUpdate: (state: TyphCommentOperator) => void;
	subscribe: (listener: (state: TyphCommentOperator) => void) => () => void;
	tracker_info: TrafficTracker;
	tracker_typh: TrafficTracker;
	tracker_vpti51: TrafficTracker;
	load: () => Promise<void> | void;
	vpti51: (filename: string) => Promise<{ headline: string; comment: string }>;
	notifyUpdate: () => void;
};

export function createTyphCommentOperator(): TyphCommentOperator {
	const listeners = new Set<(state: TyphCommentOperator) => void>();

	const operator: TyphCommentOperator = {
		url_info: "https://www.jma.go.jp/bosai/information/data/typhoon.json",
		url_typh: "https://www.jma.go.jp/bosai/typhoon/data/targetTc.json",
		data: {
			TC0101: {
				lastUpdated: 1234567890,
				comment: "あいう",
				number: 0
			}
		},
		onUpdate () {},
		subscribe (listener){
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		tracker_info: new TrafficTracker("JMA / Typhoon / typhoon.json"),
		tracker_typh: new TrafficTracker("JMA / Typhoon / targetTc.json"),
		tracker_vpti51: new TrafficTracker("JMA / Typhoon / VPTI51"),
		notifyUpdate (){
			for (const listener of listeners) listener(this);
			this.onUpdate?.(this);
		},
		async load(){
			const infolist = await fetch(this.url_info + "?_=" + Date.now()).then(res => res.json()) as TyphReportListItem[];
			this.tracker_info.update();

			const typhlist = await fetch(this.url_typh + "?_=" + Date.now()).then(res => res.json()) as TcCodeListItem[];
			this.tracker_typh.update();

			let isUpdated = false;
			for (let i = infolist.length; i; i--){
				const item = infolist[i-1];
				const epoch = new Date(item.datetime).getTime() - 0;
				if (item.header !== "VPTI51") continue;
				if (this.data[item.eventId] && this.data[item.eventId].lastUpdated >= epoch) continue;
				const { comment } = await this.vpti51(item.fileName);
				const typhNumber = Number((typhlist.find(candidate => item.eventId === candidate.tropicalCyclone)?.typhoonNumber ?? "0").slice(-2));
				this.data[item.eventId] = {
					lastUpdated: epoch,
					comment,
					number: typhNumber
				};
				isUpdated = true;
			}
			if (isUpdated) this.notifyUpdate();
		},
		async vpti51(filename){
			const data = await fetch("https://www.jma.go.jp/bosai/information/data/typhoon/" + filename).then(res => res.json());
			this.tracker_vpti51.update();
			return {
				headline: zen2han(data.headlineText.trim()),
				comment: zen2han(data.commentText.replace(/\n/g, "").trim())
			};
		}
	};

	return operator;
}
