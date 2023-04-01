const htmlFromString = (htmlString, multiLevel=false)=>{
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return multiLevel ? div.childNodes : div.firstChild;
}
const openFile = async path=>{
  const response = await fetch(path);
  const data = await response.text();
  return data;
}
const FileManager = (()=>{
  return {
    getHtml: async path=>{
      return htmlFromString(await openFile(path));
    },
    getJsonFiles: async files=>{
      return Promise.all(files.map(async file=>JSON.parse(await openFile(file))));
    }
  };
})();

export default FileManager;
