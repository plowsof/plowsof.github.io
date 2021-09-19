let modified_xmr = "1"
let modified_btc = "1"
let xor = 1 
async function getWishlist(symbol) {
    let ran_int = Math.floor(Math.random() * 100000)
    let url = ""
    if(symbol == "btc") {
        url = "https://raw.githubusercontent.com/plowsof/multi-crypto-freelance/main/json/wishlist-data-btc.json?uid=" + ran_int
    } else {
        url = "https://raw.githubusercontent.com/plowsof/multi-crypto-freelance/main/json/wishlist-data.json?uid=" + ran_int

    }
    try {
        let res = await fetch(url)
        return await res.json()
    } catch (error) {
        return null
    }
}

async function getPrice(symbol){
    //{"bitcoin":{"usd":48069}}
    if (symbol == "xmr") {
        symbol = "monero"
    } else {
        symbol = "bitcoin"
    }
    let ran_int = Math.floor(Math.random() * 100000)

    //alert(xor)
    let url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&uid=` + ran_int
    //alert(url)
    try {
        //alert(url)
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        return null;
    }
}


async function renderWishlist() {
    console.log("hello world")
    let wishlist_xmr = await getWishlist("xmr");
    let wishlist_btc = await getWishlist("btc");
    let new_info = 0
    //alert(wishlist_xmr["metadata"])
    if (wishlist_xmr["metadata"]["modified"] != modified_xmr) {
        modified_xmr = wishlist_xmr["metadata"]["modified"]
        new_info = 1
    }
    if (wishlist_btc["metadata"]["date_modified"] != modified_btc) {
        modified_btc = wishlist_btc["metadata"]["date_modified"]
        new_info = 1
    }
    //force refreshing for USD amounts
    new_info = 1
    if (new_info == 1) {
        //alert(wishlist_xmr["wishlist"][0]["xmr_total"])
        //add bitcoin totals to xmr wishlist
        //always have to combine as they are separate to avoid overwriting info
        let html_tasks = '';
        let html_events = '';
        let price_xmr = await getPrice("xmr")
        let price_btc = await getPrice("btc") 
        price_btc = price_btc["bitcoin"]["usd"]
        price_xmr = price_xmr["monero"]["usd"]
        wishlist_btc["addresses"].forEach(address => {
            //console.log("Bitcoin address..")
            //find the btc address in the xmr list then += btc_totals
            //units are 'sats'(?)
            wishlist_xmr["wishlist"].forEach(wish => {
                //console.log("Monero address..")
                if (wish.btc_address == address.address) {
                    wish.description = wish.description.replace(/<br>/g,"<br>        ")
                    let qrcheck = document.getElementById(`qr-${wish.address}`);
                    let qrchecked = (qrcheck && qrcheck.checked)?" checked":"";
                    total_btc =  (parseFloat(address.confirmed) + parseFloat(address.unconfirmed)).toFixed(6)
                    //tooltip history
                    //
                    
                    let xmr_history = ""
                    if (wish.history.length){
                        //we have history
                        if (wish.history.length <= 5) {
                            wish.history.forEach(donation => {
                                //alert(donation.amount)
                                xmr_history += ("+" + donation.amount.toFixed(5) + "<br>")
                                })
                        } else {
                            let int = -1
                            //get the 'last 5 donations'
                            while (int >= -5){
                                donation = wish.history.at(int)
                                xmr_history += ("+" + donation.amount.toFixed(5) + "<br>")
                                int -= 1
                            }
                        }
                    }else{
                        xmr_history = "No history😥"
                    }
                    let btc_history = ""
                    //console.log(address.history.length)
                    if (address.history.length){
                        //we have history
                        if (address.history.length <= 5) {
                            address.history.forEach(donation => {
                                btc_history += ("+" + donation.amount.toFixed(5) + "<br>")
                                })
                            //console.log(btc_history)
                        } else {
                            //console.log("Length > 5")
                            let int = -1
                            //get the 'last 5 donations'
                            while (int >= -5){
                                donation = address.history.at(int)
                                btc_history += ("+" + donation.amount.toFixed(5) + "<br>")
                                int -= 1
                            }
                        }
                    }else{
                        btc_history = "No history😥"
                    }

                    //locArray.at(-1)
                    //alert(xmr_history)
                    let ahead1 = wish.xmr_address.substr(0,4)
                    let ahead2 = wish.xmr_address.substr(4,4)
                    let atail1 = wish.xmr_address.substr(-8,4)
                    let atail2 = wish.xmr_address.substr(-4,4)
                    let atail = wish.xmr_address.substr(-5,5)
                    let something = ""
                    let short_xmr_add = something.concat(ahead1, " ", ahead2," .. ", atail1, " ", atail2)
                    ahead1 = wish.btc_address.substr(0,4)
                    atail1 = wish.btc_address.substr(-4,4)
                    something = ""
                    let short_btc_add = something.concat(ahead1, " .. ", atail1) 
                    wish.btc_total = total_btc
                    wish.xmr_total = wish.xmr_total.toFixed(2)
                    //wish.contributors += address.contributors
                    let ins_xmr = wish.history.length
                    let ins_btc = address.history.length
                    let real_ins = ins_btc + ins_xmr
                    wish.contributors = real_ins

                    //"btc_total": 0
                    //"xmr_total": 0
                    //"usd_total": 0 - you can add usd and - from crypto for stability
                    wish.total = (wish.btc_total * price_btc) + (wish.xmr_total * price_xmr) + (wish.usd_total)
                    wish.percent = wish.total / wish.goal_usd * 100;
                    usd_hourly = wish.total / wish.hours
                    if (usd_hourly <= (0.10 * wish.hour_goal)){
                        hour_colour = "red"
                    } else if (usd_hourly <= (0.20 * wish.hour_goal)){
                        hour_colour = "gray"
                    } else if (usd_hourly <= (0.50 * wish.hour_goal)){
                        hour_colour = "yellow"
                    } else if (usd_hourly <= (0.80 * wish.hour_goal)){
                        hour_colour = "green"
                    } else{
                        hour_colour = "cyan"
                    }
                    var current_percent = wish.percent;
                    let ascii_progress = ''
                    for (n = 0; n < 20; n++) {
                        if (current_percent < (n+1)*5) {
                            ascii_progress = ascii_progress.concat("░"); // alt-176 
                        }
                        else {
                            ascii_progress = ascii_progress.concat("▓"); // alt-178
                             }    
                    }
                    let chunk = ""
                    let chunk2 = ""
                    if (wish.type == "work"){
                        chunk = `<span class="comment">hours</span><span class="red">=</span>${wish.hours}, <span class="comment">goal$/h</span><span class="red">=</span>${wish.hour_goal}`
                        chunk2 = `
        $/h:[ <span class="${hour_colour}">$${usd_hourly.toFixed(2)}</span> ],`
                    } else {
                        chunk = `<span class="comment">goal</span><span class="red">=</span>$${wish.goal_usd}`
                    }
                    let htmlSegment = `
<pre>
<span class = wishtitle>${wish.title.replace(/ /g, "_")}</span>( `

htmlSegment+= chunk
htmlSegment += ` ){
    <span class="subtitle">What?</span>:{
        <span class=comment><span class="brackets">'''</span>
        <span class="description">${wish.description}</span> 
        <span class="brackets">'''</span></span>
    },
    <span class="subtitle">Progress</span>:{ [<span id="ascii-progress-bar">${ascii_progress}</span>]`

        htmlSegment += chunk2
        htmlSegment+= ` 
        raised: $${wish.total.toFixed(2)} / $${wish.goal_usd},
        contributors: ${wish.contributors},
        xmr: <span class="tooltip">${wish.xmr_total}<span class="tooltiptext">${xmr_history}</span></span>,
        btc: <span class="tooltip">${wish.btc_total}<span class="tooltiptext">${btc_history}</span></span>,
        usd: ${wish.usd_total}
    },
    <span class="subtitle">Donate</span>:{
        <span class=comment><span class="brackets">'''</span>
        XMR: [<span class="xmr-subaddress" onclick=CopyToClipboard('${wish.xmr_address}')>${short_xmr_add}</span>] [<a href="${wish.qr_img_url_xmr}" data-lightbox="${wish.id}" data-title="Thank you 😘">QR</a>]
        BTC: [<span class="btc-subaddress" onclick=CopyToClipboard('${wish.btc_address}')>${short_btc_add}</span>] [<a href="${wish.qr_img_url_btc}" data-lightbox="${wish.id}" data-title="Thank you 😘">QR</a>]
        <span class="brackets">'''</span></span>
    }
}
</pre>`
                    //refresh data

                    if(wish.type == "work"){
                        html_tasks += htmlSegment
                    } else {
                        html_events += htmlSegment
                    }
                //dont search further
                return
                }

            })
        })

        let container = document.querySelector('.tasks');
        container.innerHTML = html_tasks;
        let container2 = document.querySelector('.events');
        container2.innerHTML = html_events;

    }

}

function CopyToClipboard(id)
{
    navigator.clipboard.writeText(id)
    .then(() => { alert(`Address Copied!`) })
    .catch((error) => { alert(`Copy failed! ${error}`) })
}


//on page load - render the wishlist. set a 'time updated variable from the json' then loop compare
//infinite loop

renderWishlist()
setInterval('renderWishlist()',10000)





