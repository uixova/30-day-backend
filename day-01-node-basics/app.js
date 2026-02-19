const fs = require('fs');

const command = process.argv[2];
const content = process.argv[3];

if (command === 'write') {
    fs.writeFileSync('note/myNotes.txt', content + '\n', { flag: 'a' }),
    console.log("Note writing in successful");
} 

else if (command === 'read') {
    const veri = fs.readFileSync('myNotes.txt', 'utf8');
    console.log("Your notes:\n" + veri);
} 

else if (command == 'del') {
    fs.unlinkSync('myNotes.txt'),
    console.log("Note Successfully deleted!");
} 

else {
    console.log("Command not understood!", "write (message), read or del");
}