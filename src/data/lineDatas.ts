import { Lines } from "./types"

export const lines: Record<Lines, {
    color: string
    icon: string
}> = {
    "가상": {
        color: "#00000000",
        icon: "가상"
    },
    "1호선": {
        color: "#0052A4",
        icon: "1"
    },
    "2호선": {
        color: "#00A84D",
        icon: "2"
    },
    "3호선": {
        color: "#EF7C1C",
        icon: "3"
    },
    "4호선": {
        color: "#00A4E3",
        icon: "4"
    },
    "5호선": {
        color: "#996CAC",
        icon: "5"
    },
    "6호선": {
        color: "#CD7C2F",
        icon: "6"
    },
    "7호선": {
        color: "#747F00",
        icon: "7"
    },
    "8호선": {
        color: "#E6186C",
        icon: "8"
    },
    "9호선": {
        color: "#BDB092",
        icon: "9"
    },
    "인천1호선": {
        color: "#759CCE",
        icon: "인천1"
    },
    "인천2호선": {
        color: "#F5A251",
        icon: "인천2"
    },
    "경강선": {
        color: "#0054A6",
        icon: "경강"
    },
    "경의선": {
        color: "#77C4A3",
        icon: "경의\n중앙"
    },
    "경춘선": {
        color: "#178C72",
        icon: "경춘"
    },
    "공항철도": {
        color: "#0090D2",
        icon: "공항\n철도"
    },
    "서해선": {
        color: "#8FC31F",
        icon: "서해선"
    },
    "수인분당선": {
        color: "#FABE00",
        icon: "수인\n분당"
    },
    "신분당선": {
        color: "#D31145",
        icon: "신분당"
    },
    "신림선": {
        color: "#6789CA",
        icon: "신림"
    },
    "우이신설경전철": {
        color: "#B7C450",
        icon: "우이\n신설"
    },
    "김포골드라인": {
        color: "#AD8605",
        icon: "김포\n골드"
    },
    "용인경전철": {
        color: "#56AD2D",
        icon: "용인\n에버"
    },
    "의정부경전철": {
        color: "#FD8100",
        icon: "의정부"
    },
    "GTX-A": {
        color: "#9A6292",
        icon: "GTX\nA"
    },
}

export const getLineColor = (line: Lines) => lines[line].color
export const getLineIcon = (line: Lines) => lines[line].icon