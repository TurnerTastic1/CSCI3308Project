// Transit uses Google Maps Platform for routing and stochastic estimation
// Node client: https://github.com/googlemaps/google-maps-services-js
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});
const key = process.env.GCP_KEY;

const distanceAndTimeByTransit = async (olat, olng, dlat, dlng) => {
    client.directions({
        origin: { olat, olng },
        destination: { dlat, dlng },
        mode: 'transit',
        key: key
    }).then((res) => {
        if (len(res.routes) < 1)
            return (-1, -1);
        let bestRoute = res.routes[0];
        let elapsedDistance = bestRoute.reduce((total, current) => total + current.distance.value);
        let elapsedTime = bestRoute.reduce((total, current) => total + current.duration.value);
        let fare = bestRoute.fare.text;
        return (elapsedDistance, elapsedTime, fare);
    }).catch((err) => console.log(err));
}

module.exports = { distanceAndTimeByTransit };