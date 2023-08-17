const fs = require('fs')

const axios = require('axios');

class Busquedas {
    
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        });
    }

    get paramsLocationIQ() {
        return {
            'key': process.env.LOCATIONIQ_KEY,
            'format':'json',
            'accept-language':'es',
            'limit': 5
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }


    async ciudad( lugar = '' ) {

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://us1.locationiq.com/v1/search?q=${lugar}`,
                params: this.paramsLocationIQ
            });
            
            const resp = await instance.get();

            return resp.data.map( lugar => ({
                id: lugar.place_id,
                nombre: lugar.display_name,
                lng: lugar.lon,
                lat: lugar.lat

            }));

        } catch (error) {
            return [];

        }

    }

    async climaLugar( lat, lon ) {

        try {

            //instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsOpenWeather, lat, lon }
            })

            //resp.data
            const resp = await instance.get();
            const { weather, main } = resp.data;
            

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '') {

        if( this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);

        //prevenir duplicados
        this.historial.unshift( lugar.toLocaleLowerCase() );

        //grabar DB
        this.guardarDB(lugar);

    }
    
    guardarDB(){

        const payload = {
            historial: this.historial
        }
        
        fs.writeFileSync( this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        
        if( !fs.existsSync(this.dbPath) ){
            return;
        }
        
        const info = fs.readFileSync( this.dbPath, {encoding:'utf-8'} )
        const data = JSON.parse(info);

        console.log('data -->',data);

        this.historial = data.historial;

    }
}


module.exports = Busquedas;