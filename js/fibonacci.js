$(document).ready( function(){

  var CSSOverrides = {}

  function getUnstyledMarkup(cssCode){
    var clone = $('#container').clone(),
        elements = clone.find('div')
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].removeAttribute('style')
    }
    
    var returnString = $(clone)[0].outerHTML.toString()
    returnString = returnString.replace(regex = new RegExp('</div></div>',"g"), '</div>\n</div>')
                                .replace(/\</g,'&lt;')
                                .replace(/\>/g,'&gt;')

    return returnString
    clone.remove()
  }

  function insertIndentation (distanceToContainer){
    var indentation = '\n'
    for (var i = 0; i <= distanceToContainer; i++){
      (function(){
        indentation += '\t'
      }(i))
    }
    return indentation
  }

  $( '#triggerHTMLCode' ).on( 'click', function(){
    if( $(this).css('opacity') == 1 ){
      $( '#codeExportTextarea' ).css( 'display', 'none' )
      $(this).css( 'opacity', 0.6)
    }
    else {
      $( 'img' ).css( 'opacity', 0.6)
      $(this).css( 'opacity', 1)
      $( '#codeExportTextarea' ).empty()
                                .css('display', 'block')
                                .removeClass()
                                .addClass('html')
                                .append(getUnstyledMarkup())
      hljs.configure({
        tabReplace: '  '
      })
      hljs.highlightBlock($('#codeExportTextarea')[0])
    }
  })

  $( '#triggerCSSCode' ).on( 'click', function(){
    if( $(this).css('opacity') == 1 ){
      $( '#codeExportTextarea' ).css( 'display', 'none' )
      $(this).css( 'opacity', 0.6)
    }
    else {
      $( 'img' ).css( 'opacity', 0.6)
      $(this).css( 'opacity', 1)
      $.get( 'css/fibonacci.css' ).then( function( cssCode, status, xhr ){
        var overrides = ''
        for (var i = Object.keys(CSSOverrides).length - 1; i >= 0; i--) {
          singleOverride = autoprefixer({cascade: false}).process( '#' + Object.keys(CSSOverrides)[i] + '{\n ' + CSSOverrides[Object.keys(CSSOverrides)[i]] + '\n}').css
          overrides += '\n\n' + singleOverride + '\n'
        }        
        
        $( '#codeExportTextarea' ).empty()
                                  .css('display', 'block')
                                  .removeClass().addClass('css')
                                  .append( cssCode + overrides )
        hljs.highlightBlock($('#codeExportTextarea')[0])
      })
    }
  })

  $( '#triggerInfo' ).on( 'click', function(){
    if( $(this).css('opacity') == 1 ){
      $( '#codeExportTextarea' ).css( 'display', 'none' )
      $(this).css( 'opacity', 0.6)
    }
    else {
      $( 'img' ).css( 'opacity', 0.6)
      $(this).css( 'opacity', 1)

      var code =
      '<p>Fibonacci is an offshoot of an internal tool created to let non-developers design page layouts using Flexbox, without having to learn HTML or CSS.</p>' +
      '<p>Fibonacci starts with a blank &lt;div&gt;, which you can then split to your heart\'s content. It generates both the HTML and CSS needed to recreate the layout in your own pages. ' +
      'After you\'ve made your horizontal or vertical split, you can then add a new sibling, shrink or expand, give it a fixed width/height, remove or split it again.<br>' +
      'Remember to add a unit when you enter a fixed width or height!</p>' +
      '<p>Once you\'re happy with the layout, hit the export icons to copy the generated code and paste it wherever you need it in your own code.</p>' +
      '<p>Fibonacci does *not* use the Fibonacci sequence in any way, despite reports to the contrary. The reasoning behind the name  is simple. While testing the tool, I divided the main container into a Fibonacci-esque structure. That\'s it. The structured reminded me of Fibonacci, I liked the ring of it, I called the tool Fibonacci. The End.</p>' +
      '<p>Tiny sidenote: Fibonacci is mostly a little sideproject and by no means perfect or bug free. Contributions are highly welcome :)</p>'

      $( '#codeExportTextarea' ).empty()
                                .css('display', 'block')
                                .removeClass()
                                .append( code )
    }
  })

  function addSplitControls( srcDiv ){
    var parent = $(srcDiv).parent()
    if( $( '#splitControls' ).length == 0 && $( '#optionsModal' ).length == 0){
      $( srcDiv ).append( '<div id="splitControls">' )
      $( '#splitControls' ).append( '<img id="splitVerticalIcon" data-layout-action="splitvertical" src="img/splitvertical.png" alt="Split vertically">' )
                            .append( '<img id="splitHorizontalIcon" data-layout-action="splithorizontal" src="img/splithorizontal.png" alt="Split horizontally" title="Split horizontally">' )

      if( parent.hasClass( 'columnParent' ))
        $( '#splitControls' ).append( '<img id="addHorizontalIcon" data-layout-action="addhorizontal" src="img/addhorizontal.png" alt="Add horizontal sibling" title="Add horizontal sibling">' )

      if( parent.hasClass( 'rowParent' ))
        $( '#splitControls' ).append( '<img id="addVerticalIcon" data-layout-action="addvertical" src="img/addvertical.png" alt="Add vertical sibling" title="Add vertical sibling">' )

    }
  }


  $( 'body' ).on( 'mouseover', '#container, #container div', function(e){
    addSplitControls(this)
  })

  $( 'body' ).on( 'click', '#container, #container div', function(e){
    e.stopPropagation()
    if( $(this).hasClass('selected') ){
      $(this).removeClass('selected')
      $("#optionsBar").addClass('disabled')
    }
    else {
      $('div.selected').removeClass('selected')
      $(this).addClass('selected')
      $('#optionsBar').removeClass('disabled')

      if( $('div.selected').parent().attr('id') != 'container' ){
        $("#parentDimensionSizeInput, #enterParentDimensionButton ").removeClass('disabled')
        var parentDimension = $('div.selected').parent().hasClass( 'columnParent' ) ? 'width' : 'height'
        $("#parentDimensionSizeInput").attr('placeholder', 'Parent\'s ' + parentDimension )
      } else {
        $("#parentDimensionSizeInput, #enterParentDimensionButton ").addClass('disabled')
      }
    }
  })

  $( 'body' ).on( 'mouseleave', '#container, #container div', function(e){
    e.stopPropagation()
    $('#splitControls').remove()
    $('#optionsModal').remove()
  })


  $( 'body' ).on( 'click', '#splitControls img', function(e){
    e.stopPropagation()
    $('div.selected').removeClass('selected')
    $('#optionsBar').addClass('disabled')
    var parentDiv = $(this).parent().parent(),
        grandParent = parentDiv.parent(),
        action = $(this).data('layout-action'),
        indentCount = 0

    if( $(parentDiv)[0].id != 'container' )
      indentCount = (parentDiv.parentsUntil($('#container')).andSelf().length)

    /*//////////////////////////////////////
    // Split current row in two
    //////////////////////////////////////*/
    if (action == 'splitvertical'){
      var id1 = Math.floor(Math.random() * 100000 + 1)
      var id2 = Math.floor(Math.random() * 100000 + 1)

      parentDiv.append( insertIndentation(indentCount) + '<div id="rowChild' + id1 + '"></div>\n' )
              .append( insertIndentation(indentCount) + '<div id="rowChild' + id2 + '"></div\n>' )
              .addClass( 'rowParent' )
              .find( 'div' ).not('#splitControls').each(function(){
                $(this).addClass( 'flexChild' )
                if( $(this).data( 'flexsize') == undefined)
                    $(this).data( 'flexsize', 1 )
              })
      $( '#splitControls' ).remove()
    }

    /*//////////////////////////////////////
    // Split current column in two
    //////////////////////////////////////*/
    else if (action == 'splithorizontal'){
      parentDiv.append( insertIndentation(indentCount) + '<div id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
              .append( insertIndentation(indentCount) + '<div id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
              .addClass( 'columnParent' )
              .find( 'div' ).not('#splitControls').each(function(){
                $(this).addClass( 'flexChild' )
                if( $(this).data( 'flexsize') == undefined)
                    $(this).data( 'flexsize', 1 )
              })
      $( '#splitControls' ).remove()
    }

    /*//////////////////////////////////////
    // Add extra row
    //////////////////////////////////////*/
    else if(action == 'addvertical'){
      if( grandParent.hasClass( 'rowParent' )){
        $(grandParent).append( insertIndentation(indentCount) + '<div id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
                      .find( 'div' ).not('#splitControls').each(function(){
                        $(this).addClass( 'flexChild' )
                        if( $(this).data( 'flexsize') == undefined)
                            $(this).data( 'flexsize', 1 )
                      })
        $( '#splitControls' ).remove()
      }
      else {
        alert( 'You need to split vertically first.')
      }
    }

    /*//////////////////////////////////////
    // Add extra column
    //////////////////////////////////////*/
    else if(action == 'addhorizontal'){
     if( grandParent.hasClass( 'columnParent' )){
        $(grandParent).append( insertIndentation(indentCount) + '<div id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
                      .find( 'div' ).not('#splitControls').each(function(){
                        $(this).addClass( 'flexChild' )
                        if( $(this).data( 'flexsize') == undefined)
                            $(this).data( 'flexsize', 1 )
                      })
        $( '#splitControls' ).remove()
      }
      else {
        alert( 'You need to split horizontally first.')
      }
    }
  })


  /*/////////////////////////////////////////////
  // Increase flexsize
  /////////////////////////////////////////////*/
  $( '#growDivButton').on( 'click', function(){
    var selectedDiv = $('div.selected')
      selectedDiv.css({
        'flex-grow': selectedDiv.data( 'flexsize' ) + 1
      })
      selectedDiv.data('flexsize', selectedDiv.data( 'flexsize' ) + 1)
      CSSOverrides[ selectedDiv.attr( 'id' ) ] = selectedDiv.attr( 'style' )
  })

  /*/////////////////////////////////////////////
  // Decrease flexsize
  /////////////////////////////////////////////*/
  $( '#shrinkDivButton' ).on( 'click', function(){
    var selectedDiv = $('div.selected')
    if (selectedDiv.data( 'flexsize' ) > 1){
      selectedDiv.css({
        'flex-grow': selectedDiv.data( 'flexsize' ) - 1
      })
      selectedDiv.data('flexsize', selectedDiv.data( 'flexsize' ) - 1)
      CSSOverrides[ selectedDiv.attr( 'id' ) ] = selectedDiv.attr( 'style' )
    }
  })

  /*/////////////////////////////////////////////
  // Enter fixed width/height for current div
  /////////////////////////////////////////////*/
  $( '#enterWidthButton, #enterHeightButton' ).on( 'click', function(e){
    var selectedDiv = $('div.selected')
        dimension = $(e.target).attr('title')
        size = $( '#' + dimension + 'Input' ).val()

      selectedDiv.css({
        'flex': ' none'
      })
      .css(dimension, size)
      CSSOverrides[ selectedDiv.attr( 'id' ) ] = selectedDiv.attr( 'style' )
  })

  /*/////////////////////////////////////////////
  // Enter fixed width/height for selected div's parent
  /////////////////////////////////////////////*/
  $( '#enterParentDimensionButton' ).on( 'click', function(){
    var selectedDiv = $('div.selected'),
        selectedDivParent = $('div.selected').parent(),
        parentDimension = selectedDivParent.hasClass( 'columnParent' ) ? 'width' : 'height'
    
    selectedDivParent.css({
        'flex': ' none'
      })
    .css(parentDimension, $( '#parentDimensionSizeInput' ).val())

    CSSOverrides[ selectedDivParent.attr( 'id' ) ] = selectedDivParent.attr( 'style' )
  })


  /*/////////////////////////////////////////////
  // Set justification within parent
  /////////////////////////////////////////////*/
  $( '#justifyButton' ).on( 'change', function(){
    var selectedDivParent = $('div.selected').parent()

    selectedDivParent.css({
      'justify-content': $(this).val()
    })
    CSSOverrides[ selectedDivParent.attr( 'id' ) ] = selectedDivParent.attr( 'style' )
  })


  /*/////////////////////////////////////////////
  // Set single alignment
  /////////////////////////////////////////////*/
  $( '#singleAlignmentButton' ).on( 'change', function(){
    var selectedDiv = $('div.selected')

    selectedDiv.css({
      'align-self': $(this).val()
    })
    CSSOverrides[ selectedDiv.attr( 'id' ) ] = selectedDiv.attr( 'style' )
  })


  /*/////////////////////////////////////////////
  // Set global alignment for parent
  /////////////////////////////////////////////*/
  $( '#allAlignmentButton' ).on( 'change', function(){
    var selectedDivParent = $('div.selected').parent()

    selectedDivParent.css({
      'align-items': $(this).val()
    })
    CSSOverrides[ selectedDivParent.attr( 'id' ) ] = selectedDivParent.attr( 'style' )
  })


  /*/////////////////////////////////////////////
  // Remove current div from DOM
  /////////////////////////////////////////////*/
  $( '#removeDivButton' ).on( 'click', function(){
    var selectedDiv = $('div.selected')
    if (selectedDiv != $('#container')[0]){
      delete CSSOverrides[ selectedDiv.attr( 'id' )]
      selectedDiv.remove()
    }
  })

})
