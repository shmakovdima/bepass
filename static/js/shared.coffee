class @Flash
  constructor: (
    @div_id
  ) ->
    @stack = []
    @timeout = 5000
    @init_div()

  init_div: ->
    e = $ "<div id='#{@div_id}'></div>"
    e.appendTo 'html'
    @base_el = $("#" + @div_id)

  show: (
    message
  ) ->
    el = $ "<div class='child'>#{message}</div>"
    el.appendTo @base_el
    that = @
    t = window.setTimeout ()->
                            that.hide(el)
                          , @timeout
    @stack.push({t: t, el: el})

  hide: (
    item, clean
  ) ->
    new_stack = []
    for i in @stack
      if i.el == item
        i.el.remove()
        window.clearTimeout(i.t)
      else
        if not clean
          new_stack.push i

    if not clean
      @stack = new_stack

  hide_all: ->
    for s in @stack
      @hide s.el true
      window.clearTimeout s.t


$('[data-href]').on 'click', () ->
  document.location.href = $(this).data('href')


@set_get_param = (
  name_, value_
) ->
  obj = {}
  if typeof name_ != 'object'
    obj[name_] = value_
  else
    obj = name_

  url = document.location.href.split('?')
  addr = url.shift()
  new_params = {}
  erase = []
  for n,v of obj
    if not v or v == 'null' or v == ''
      erase.push(n)

  if url.length == 0 or url[0] == ''
    for name, value of obj
      new_params[name] = value
  else
    params = url[0].split('&')
    obj_ = obj
    for param in params
      param = param.split('=')
      for name, value of obj
        if param[0] == name
          param[1] = value
          delete obj_[name]
      if param[0] and param[1]
        new_params[param[0]] = param[1]

    for name, value of obj_
      new_params[name] = value

  for e in erase
    delete new_params[e]

  params = []
  for k, v of new_params
    params.push("#{k}=#{v}")

  new_params = params.join('&')

  document.location.href = "#{addr}?#{new_params}"


send_search = () ->
  val = $('.search').val()
  if not val
    set_get_param({query: 'null', page: 'null'})
  else
    set_get_param({query: val, page: 'null'})

$(document).ready ()->
  $('.search').on 'blur', () ->
    send_search()
  $('.search').on 'keypress', (e) ->
    if e.which == 13
      send_search()