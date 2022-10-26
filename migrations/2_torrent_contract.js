const XENTorrent = artifacts.require("XENTorrent");
const XENCrypto = artifacts.require("XENCrypto");
const DateTime = artifacts.require("DateTime");
const Quotes = artifacts.require("Quotes");

require("dotenv").config();

const xenContractAddress = process.env.XEN_CONTRACT_ADDRESS;
const dateTimeAddress = process.env.DATETIME_CONTRACT_ADDRESS;
const quotesAddress = process.env.QUOTES_CONTRACT_ADDRESS;

module.exports = async function (deployer, network) {
  if (dateTimeAddress && network !== 'test') {
    console.log('using existing DateTime at', dateTimeAddress)
    const dt = await DateTime.at(dateTimeAddress);
    await deployer.link(dt, XENTorrent);
  } else {
    await deployer.deploy(DateTime);
    await deployer.link(DateTime, XENTorrent);
  }

  if (quotesAddress && network !== 'test') {
    console.log('using existing Quotes at', quotesAddress)
    const qs = await Quotes.at(dateTimeAddress);
    await deployer.link(qs, XENTorrent);
  } else {
    await deployer.deploy(Quotes);
    await deployer.link(Quotes, XENTorrent);
  }

  if (xenContractAddress && network !== 'test') {
    await deployer.deploy(XENTorrent, xenContractAddress);
  } else {
    const xenContract = await XENCrypto.deployed();
    // console.log(network, xenContract?.address)
    await deployer.deploy(XENTorrent, xenContract.address);
  }
};
