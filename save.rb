#!/Ruby21-x64/bin/ruby

require 'cgi'
require 'kirbybase'
require 'json'

MACHINES_PATH = './machines'

cgi = CGI::new()
status = 'OK'

begin
  # create a new database instance
  # specifying memo_blob_path
  db = KirbyBase.new(:local, nil, nil, './', '.tbl', MACHINES_PATH)

  # create or get table
  if db.table_exists?(:machines)
    tbl = db.get_table(:machines)
  else
    Dir.mkdir(MACHINES_PATH) unless File.directory?(MACHINES_PATH)
    tbl = db.create_table(:machines, :state, :Blob)
  end

  machine = JSON.parse(cgi['machine'])
  filename = machine['filename']

  blob = KBBlob.new(db, filename, machine)
  tbl.insert(blob)

  result = JSON.generate({result: true})

rescue => e
  result = JSON.generate({result: "#{e}"})
  status = 'SERVER_ERROR'
ensure
  cgi.out(
      'type' => 'application/json',
      'status' => status
  ) { result }
end


