import Jasmine from 'jasmine';
import path from 'path';

const jasmine = new Jasmine();
jasmine.loadConfigFile(path.resolve(__dirname, 'support', 'jasmine.json'));
jasmine.execute();
