const searchBox = document.getElementById('search-box');
const infoBox = document.getElementById('info-box');

const APIKEY = '423670e059fc4217895195818232002';
const APIURL = 'http://api.weatherapi.com/v1/';

let searchVal = '';

const styles = {
  searching: {
    boxShadow: 'none',
    borderRadius: '2px 2px 0 0'
  },
}

const fetchFunction = async (req) => {
  try {
    const res = await fetch(req);
    const resJSON = await res.json();
    return resJSON;
  } catch(err) {
    console.log(err);
  }
}

const selectedOption = async (x) => {
  const { id } = x.target;
  const [ lon, lat ] = id.split('T');

  const req = `${APIURL}current.json?key=${APIKEY}&q=${lat},${lon}`;

  const currentData = await fetchFunction(req);

  deleteOptions();

  renderInfo(currentData);
}

// GET INPUT VALUE
searchBox.addEventListener('input', async (x) => {
  const str = x.target.value;
  const req = `${APIURL}search.json?key=${APIKEY}&q=${str}`;
  const search = await fetchFunction(req);
  if(search.length === 0) return;
  renderSearchOptions(search);
});


const renderSearchOptions = (search) => {
  const searchContainer = document.getElementById('search-container');

  deleteOptions();

  changeStyles(searchBox, styles.searching);

  search.forEach(d => {

    const { name, region, country, lat, lon } = d;

    const searchOption = document.createElement('div');
    const optionTitle = document.createElement('h3');
    const optionLocation = document.createElement('p');

    searchOption.classList.add('search-option');

    optionTitle.innerText = `${name}, ${region}, ${country}`;
    optionLocation.innerText = `Lon: ${lon}, Lat: ${lat}`;

    searchOption.setAttribute('id',`${lon}T${lat}`);

    searchContainer.appendChild(searchOption);

    searchOption
      .appendChild(optionTitle)
      .appendChild(optionLocation);

    searchOption.addEventListener('click',selectedOption);
  });
}

const changeStyles = (node, styles) => {
  Object.keys(styles)
    .forEach(key => {
      node.style[key] = styles[key];
    });
}

const deleteOptions = () => {
  const so = document.querySelectorAll('.search-option');
  so.forEach(so => so.remove());
}

const renderInfo = (d) => {
  const { name, region, country, localtime_epoch } = d.location;
  const { temp_c, temp_f, wind_dir, wind_kph, wind_mph, humidity, uv, cloud } = d.current;
  const { code, icon, text } = d.current.condition;

  const [ date, time ] = getDate(localtime_epoch);

  const iconStyle = {
    background: `url(http:${icon})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  const principalBox = document.createElement('div');
  const locationTitle = document.createElement('h2');
  const locationTime = document.createElement('p');
  const currentImage = document.createElement('div');
  const condition = document.createElement('p');

  searchBox.value = `${name}, ${region}, ${country}`;

  currentImage.classList.add('current-image');
  // changeStyles(currentImage,iconStyle);

  locationTitle.innerText = `${name}, ${country}`;
  locationTime.innerText = `${date} | Local time: ${time}`;
  condition.innerText = text;

  principalBox.setAttribute('id','principal-container');
  condition.setAttribute('id','condition-text');

  infoBox.appendChild(principalBox);

  principalBox.appendChild(locationTime);
  principalBox.appendChild(locationTitle);
  principalBox.appendChild(currentImage);
  principalBox.appendChild(condition);
}

const getDate = (epoch) => {
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  const seconds = epoch * 1000;
  const d = new Date(seconds);
  return [ date, time ] = d.toLocaleDateString('en-US',options).split(' at ');
  
}