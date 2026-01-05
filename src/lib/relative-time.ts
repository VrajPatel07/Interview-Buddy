
export function getRelativeTime(date : Date) {

    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    for (const unit of units) {
        const value = Math.floor(diff / unit.seconds);
        if (value >= 1) {
            return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
    
}
