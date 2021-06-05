const datetime = {
  get_timestamp(){
    return new Date().getTime()
  },

  get_timestamp_secs() {
    return Math.round(new Date().getTime()/1000)
  },

  get_timestamp_diff(large, small) {
    return parseInt(large) - parseInt(small)
  },

  get_ymdhis(){
    const get_random = () => Math.random() * 1000
    const pad2 = n => n < 10 ? "0" + n : n
    const date = new Date();
    return (date.getFullYear().toString() + 
              pad2(date.getMonth() + 1) + pad2( date.getDate()) + 
              pad2( date.getHours() ) + pad2( date.getMinutes() ) + 
              pad2( date.getSeconds() )) + get_random()
  }

}

export default datetime;