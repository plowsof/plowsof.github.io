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
    let id = 0
    let ran_int = Math.floor(Math.random() * 101);
    wishlist.forEach(wish => {

    let htmlSegment =`  <div class ="wish">
                            <li>
                                ${wish.desc} : <i class="fundgoal">Raised ${wish.total} of ${wish.goal} XMR   <progress id="file" max="100" value="${wish.percent}">${wish.percent}%</progress> Contributors: ${wish.contributors}</i>
                                <label for="file"></label>
                                <p class="subaddresses" id="${id}" onclick=CopyToClipboard('${id}')>${wish.address}</p>${ran_int}<br/>
                            </li>
                        </div>`;
        html += htmlSegment;
    id += 1;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

async function CopyToClipboard(id)
{
    var node = document.getElementById(id);
    htmlContent = node.innerHTML;
    // htmlContent = "Some <span class="foo">sample</span> text."
    textContent = node.textContent;
    // textContent = "Some sample text."
    node.focus();
    navigator.clipboard.writeText(textContent)
    .then(() => { alert(`Copied!`) })
    .catch((error) => { alert(`Copy failed! ${error}`) })
}
//on page load - render the wishlist. set a 'time updated variable from the json' then loop compare
//infinite loop
renderWishlist()
setInterval('renderWishlist()',1000)
