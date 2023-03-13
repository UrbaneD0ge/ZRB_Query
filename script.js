form.addEventListener('submit', async function (event) {
  event.preventDefault();

  // const form = document.getElementById('form');
  let Zquery = document.getElementById('Zquery').value;
  let status = document.getElementById('status');
  let decision = document.getElementById('decision');
  let link = document.getElementById('link');
  let Zstatus = '';
  let ordLink = '';
  // let decisionSpace = '';
  await fetch(`https://gis.atlantaga.gov/dpcd/rest/services/LandUsePlanning/LandUsePlanning/MapServer/10/query?where=DOCKET_NO%3D'${Zquery}'&outFields=ORDHYPERLINK,%20STATUSTYPE&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&returnExtentOnly=false&f=pjson`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.features[0].attributes);
      if (data.features[0].attributes.ORDHYPERLINK)
        ordLink = data.features[0].attributes.ORDHYPERLINK || 'No Data';
      Zstatus = data.features[0].attributes.STATUSTYPE;
      return { ordLink, Zstatus }
    })
    .catch((err) => {
      document.getElementById('status').innerText = 'No Data';
      console.log(err);
    });

  switch (Zstatus) {
    case 'Complete':
      status.innerText = Zstatus;
      status.style.color = 'green';
      decision.innerText = 'ZRB - Approval';
      copyDecision();
      // saveData();
      break;
    case 'Correction':
      status.innerText = Zstatus;
      status.style.color = 'blue';
      decision.innerText = '-';
      break;
    case 'Denied':
      status.innerText = Zstatus;
      status.style.color = 'red';
      decision.innerText = 'ZRB - Denial';
      copyDecision();
      // saveData();
      break;
    case 'Filed':
      status.innerText = Zstatus;
      status.style.color = 'purple';
      decision.innerText = '-';
      // saveData();
      break;
    case 'Pending':
      status.innerText = Zstatus;
      status.style.color = 'orange';
      decision.innerText = '-';

      // saveData();
      break;
    case 'Reserved':
      status.innerText = Zstatus;
      status.style.color = 'brown';
      decision.innerText = '-';
      break;
    default:
      status.innerText = Zstatus || 'No Data';
      status.style.color = 'black';
      link.innerText = 'No Data';
      decision.innerText = '-';
      break;
  }

  if (ordLink !== 'No Data') {
    link.innerText = Zquery;
    link.setAttribute('href', ordLink);
    link.setAttribute('target', '_blank');
  } else {
    link.innerText = 'No Data';
    link.removeAttribute = 'href';
  }
  // clear form
  form.reset();
  // clear variables
  Zquery = '';
  ordLink = '';
  Zstatus = '';
});

// function saveData() {
//   let Zquery = document.getElementById('Zquery').value;
//   let status = document.getElementById('status').innerText;
//   let link = ordLink;
//   let data = {
//     Zquery,
//     status,
//     link
//   };
//   let dataArray = [];
//   dataArray.push(data);
//   localStorage.setItem('data', JSON.stringify(dataArray));
// };

// const ZqueryInput = document.getElementById("Zquery");

// ZqueryInput.oninput = (e) => {
//   e.target.value = formatZquery(e.target.value);
//   console.log('Input is inputting...')
// };

// //  format the Zquery input
// function formatZquery(zQueryString) {
//   try {
//     var match = zQueryString.match(/(^[vz]{1})\-([\d]{2})\-([\d]{1,3})$/gi);
//     return [
//       match[0].slice(0, 1).toUpperCase(),
//       match[1].slice(1, 3),
//       match[2].slice(4, 7)
//     ].join("-");
//   } catch (err) {
//     console.log(err);
//   }
// }

// copy decision to clipboard
function copyDecision() {
  let decision = document.getElementById('decision');
  let range = document.createRange();
  range.selectNode(decision);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  navigator.clipboard.writeText(decision.innerText);
  window.getSelection().removeAllRanges();
  console.log(`${Zquery.value}: '${decision.innerText}' copied to clipboard`);
}