#!/usr/bin/ruby

require 'cgi'
require 'mysql'
require 'json'

cgi = CGI::new
status = 'OK'

begin
  conn = Mysql::new '127.0.0.1', 'mqrieckc_bdc', '3rsk!n31', 'mqrieckc_bdc'

  name = Mysql.escape_string(cgi['name'])
  conn.query("delete from machines where name='#{name}';")

  result = {result: true}

rescue Mysql::Error => e
  result = {result: "#{e}"}
  status = 'SERVER_ERROR'
ensure
  conn.close unless conn.nil?
  cgi.out(
      'type' => 'application/json',
      'status' => status
  ) { JSON.generate(result) }
end
