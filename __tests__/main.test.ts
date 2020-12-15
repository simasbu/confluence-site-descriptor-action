import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('success flow', () => {
  process.env['INPUT_LOCALDIRECTORY'] = 'src'
  process.env['INPUT_HOMEPAGETITLE'] = 'My title'
  process.env['INPUT_PARENTPAGETITLE'] = 'Home page title'
  process.env['INPUT_SPACEKEY'] = 'My space'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
