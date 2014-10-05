#!/usr/bin/ruby

require 'cgi'
require 'mysql'
require 'json'

cgi = CGI::new
status = 'OK'

begin
  conn = Mysql::new '127.0.0.1', 'mqrieckc_bdc', '3rsk!n31', 'mqrieckc_bdc'

  machine = cgi['machine']
  parsed = JSON.parse(machine)

  name = Mysql.escape_string(parsed['name'])
  machine = Mysql.escape_string(machine)

  statement = "INSERT INTO machines (name, data, created_at, updated_at) VALUES ('#{name}', '#{machine}', NOW(), NOW());"
  conn.query(statement)

  result = JSON.generate({result: true})

rescue Mysql::Error => e
  result = JSON.generate({result: "#{e}"})
  status = 'SERVER_ERROR'
ensure
  conn.close unless conn.nil?
  cgi.out(
      'type' => 'application/json',
      'status' => status
  ) { result }
end


