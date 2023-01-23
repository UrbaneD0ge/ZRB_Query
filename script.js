form.addEventListener('submit', async function (event) {
  event.preventDefault();

  // const form = document.getElementById('form');
  let Zquery = document.getElementById('Zquery').value;
  let status = document.getElementById('status');
  let link = document.getElementById('link');
  let Zstatus = '';
  await fetch(`https://gis.atlantaga.gov/dpcd/rest/services/LandUsePlanning/LandUsePlanning/MapServer/10/query?where=DOCKET_NO%3D'${Zquery}'&outFields=ORDHYPERLINK,%20STATUSTYPE&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&returnExtentOnly=false&f=pjson`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      ordLink = data.features[0].attributes.ORDHYPERLINK;
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
      link.innerText = Zquery;
      link.setAttribute('href', ordLink);
      link.setAttribute('target', '_blank');
      break;
    case 'Denied':
      status.innerText = Zstatus;
      status.style.color = 'red';
      link.innerText = Zquery;
      link.setAttribute('href', ordLink);
      link.setAttribute('target', '_blank');
      break;
    case 'Withdrawn':
      status.innerText = Zstatus;
      status.style.color = 'purple';
      link.innerText = Zquery;
      link.setAttribute('href', ordLink);
      link.setAttribute('target', '_blank');
      break;
    case 'Pending':
      status.innerText = Zstatus;
      status.style.color = 'orange';
      link.innerText = Zquery;
      link.setAttribute('href', ordLink);
      link.setAttribute('target', '_blank');
      break;
    default:
      status.innerText = 'No Data';
      status.style.color = 'black';
      link.innerText = 'No Data';
      break;
  }

  // clear form
  form.reset();
});