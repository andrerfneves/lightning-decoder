
let wasmPromise = null;

async function getWasmModule() {
  if (!wasmPromise) {
    wasmPromise = import('boltz-bolt12'); // Dynamic import, works with Webpack 5
  }
  return wasmPromise;
}

async function decode(encodedOffer) {
  if (typeof encodedOffer !== 'string') throw new Error('Offer must be string');
  if (encodedOffer.slice(0, 4).toLowerCase() !== 'lno1') throw new Error('Not a proper offer');

  const wasm = await getWasmModule();
  const offer = new wasm.Offer(encodedOffer);


  const decodedOffer = {
    "offer_id": Buffer.from(offer.id).toString('hex'),
    "offer_signing_pubkey": Buffer.from(offer.signing_pubkey).toString('hex'),
    "offer_amount_msats": offer.amount,
    "offer_amount_currency": offer.amount ? "BTC" : null,
    "offer_description": offer.description,
    "offer_paths": decodePaths(offer.paths)
  }
  return decodedOffer;
}

function decodePaths(paths) {
  return paths.map((path) => ({
    offer_path_introduction_node: path.introduction_node ? Buffer.from(path.introduction_node).toString('hex') : "short channel id",
    offer_path_blinding_point: Buffer.from(path.blinding_point).toString('hex'),
    offer_path_hops: decodeHops(path.hops)
  }));
}

function decodeHops(hops) {
  return hops.map((hop) => ({
    offer_hop_pubkey: Buffer.from(hop.pubkey).toString('hex'),
    offer_hop_encrypted_payload: Buffer.from(hop.encrypted_payload).toString('hex'),
  }))
}

const decoder = {
  decode,
};

export default decoder;