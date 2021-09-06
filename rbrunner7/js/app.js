async function getWishlist() {
    let url = 'https://raw.githubusercontent.com/plowsof/plowsof.github.io/main/rbrunner7/wishlist-data.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        alert(error);
    }
}

async function renderWishlist() {
    let wishlist = await getWishlist();
    let html = '';
    let ran_int = Math.floor(Math.random() * 101);
    wishlist.forEach(wish => {

    let htmlSegment =`  <div class ="wish">
                            <li>
                                ${wish.desc} : <i class="fundgoal">Raised ${wish.total} of ${wish.goal} XMR   <progress id="file" max="100" value="${wish.percent}">${wish.percent}%</progress> Contributors: ${wish.contributors}</i>
                                <label for="file"></label>
                                <p class="subaddresses">${wish.address} wejavascriptnow${ran_int}</p>
                            </li>
                        </div>`;
        html += htmlSegment;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

//infinite loop
setInterval('renderWishlist()',1000)
