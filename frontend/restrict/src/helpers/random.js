export const get_rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const get_uuid = (length=14) => {
    const ar = [
        "abcdefghijklmnopqrstuvxyz", //0: letras
        "0123456789"                 //1: números
    ]
    const r = new Array(length).fill(0).map(()=>{
        //indica de modo aleatorio si se usará letras o números
        let i = get_rnd(0,1)
        //si i=0 => letras, sino (i=1) numeros
        let str = ar[i]
        //si es 1 se pasará a mayusculas el string obtenido, evidentemente para los números
        //no hay mayor efecto
        str = get_rnd(0,1) ? str.toUpperCase() : str
        //se obtendrá un valor entre 0 y la longitud del string anterior 10 o 25
        const max = str.length - 1
        i = get_rnd(0, max)
        return str.split("")[i]
    }).join("")
    return r
}

export default get_uuid