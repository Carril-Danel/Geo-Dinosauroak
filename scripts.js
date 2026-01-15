  const map = L.map('map').setView([40.3, -3.7], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const markers = L.markerClusterGroup();
  let erregistroak = [];

  const url =
    "https://paleobiodb.org/data1.2/occs/list.json" +
    "?base_name=Dinosauria&cc=ES" +
    "&show=coords,taxon,geo,time,ident,phylo";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      erregistroak = data.records.filter(d => d.eag && d.eag >= 66);
      margotuMarkatzaileak(erregistroak);
    });

  function margotuMarkatzaileak(zerrenda) {
    markers.clearLayers();

    zerrenda.forEach(dino => {
      if (!dino.lat || !dino.lng) return;

      const izena =
        dino.tna ||
        dino.taxon_name ||
        "Izen ezezaguna";

      const taldea =
        dino.cll ||
        dino.phl ||
        "Talde ezezaguna";
        
      const hasiera = dino.eag ? dino.eag + " M" : "?";
      const amaiera = dino.lag ? dino.lag + " M" : "?";

      const deskripzioa =
        dino.gcm ||
        "Talde ezezaguna";

      const marker = L.marker([dino.lat, dino.lng]).bindPopup(`
        <b style="font-size:15px">${izena}</b>
      <ul>
        <li>
         <b>Taldea:</b> ${taldea}
        </li>
        <li>
         <b>Antzinatasuna:</b> ${hasiera} - ${amaiera}
        </li>
        <li>
         <b>Lekuaren deskripzioa(ingeleraz):</b> ${deskripzioa}
        </li>
      </ul>
      `);

      markers.addLayer(marker);
    });

    map.addLayer(markers);
  }

  function filtratu(epoka) {
    if (epoka === 'all') {
      margotuMarkatzaileak(erregistroak);
      return;
    }

    let min, max;
    if (epoka === 'Triassic') { min = 201; max = 252; }
    if (epoka === 'Jurassic') { min = 145; max = 201; }
    if (epoka === 'Cretaceous') { min = 66; max = 145; }

    const filtratuak = erregistroak.filter(dino => {
      if (!dino.eag) return false;
      const adina = parseFloat(dino.eag);
      return adina >= min && adina <= max;
    });

    margotuMarkatzaileak(filtratuak);
  }