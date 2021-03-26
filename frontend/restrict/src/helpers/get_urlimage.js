const APIFY_BASEURL = process.env.ENV_APIFY_BASEURL

export default function get_urlimage(prodimg){
  const defimage = APIFY_BASEURL+"/pictures/products/product_0.png"
  //alert(prodimg)
  if(prodimg == null) return defimage
  
  if(prodimg.includes("http")) return prodimg

  return APIFY_BASEURL+"/pictures/products/"+prodimg
}
