export function corsOption() {
const whitelist = process.env.WHITELIST.split(",");
const corsOptions = {
    origin: function (origin, callback) {
    if(!origin){
        return callback(null , true)
    }
    if (whitelist.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error("Not Allowd By CORS"));
    }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
};

    return corsOptions;
}
