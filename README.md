# electron-virtual-midi

Because currently virtual midi ports are unsupported:

https://github.com/WebAudio/web-midi-api/issues/45
https://github.com/WebAudio/web-midi-api/issues/124
https://github.com/WebAudio/web-midi-api/issues/150

This project extends the browser with midi.js for node.
It opens a virtual input and output port and uses electron ICP to communicate midi messages between client and server.

To run you need to rebuild the native midi.js module to make it compatible with the electron node version (6.4.4)

	npm install
	./node_modules/.bin/electron-rebuild
	npm run dev
