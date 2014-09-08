//TODO: data-flexsize shenanigans

$(document).ready( function(){

  var CSSOverrides = {}

  function getUnstyledMarkup(){
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
          overrides += '#' + Object.keys(CSSOverrides)[i] + '{  ' + CSSOverrides[Object.keys(CSSOverrides)[i]] + '}'
        }
        $( '#codeExportTextarea' ).empty()
                                  .css('display', 'block')
                                  .removeClass().addClass('css')
                                  .append( cssCode + '' + overrides )
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
      '<p>Fibonacci starts with a blank &lt;div&gt;, which you can then split to your heart\'s content. It generates both the HTML and CSS needed to recreate the layout in your own pages.' +
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

      if ( srcDiv.id != 'container' )
        $( '#splitControls' ).append( '<img id="addHorizontalIcon" data-layout-action="options" src="img/options.png" alt="More options" title="More options">' )

    }
  }

  $( 'body' ).on( 'mouseover', 'div', function(e){
    addSplitControls(this)
  })

  $( 'body' ).on( 'mouseleave', 'div', function(e){
    e.stopPropagation()
    $('#splitControls').remove()
    $('#optionsModal').remove()
  })

  $( 'body' ).on( 'click', '#splitControls img', function(){
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
      parentDiv.append( insertIndentation(indentCount) + '<div id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
              .append( insertIndentation(indentCount) + '<div id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '"></div\n>' )
              .addClass( 'rowParent' )
              .find( 'div' )
                .addClass( 'flexChild' )
                .data( 'flexsize', 1 )
    }

    /*//////////////////////////////////////
    // Split current column in two
    //////////////////////////////////////*/
    else if (action == 'splithorizontal'){
      parentDiv.append( insertIndentation(indentCount) + '<div id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
              .append( insertIndentation(indentCount) + '<div id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
              .addClass( 'columnParent' )
              .find( 'div' )
                .addClass( 'flexChild' )
                .data( 'flexsize', 1 )
    }

    /*//////////////////////////////////////
    // Add extra row
    //////////////////////////////////////*/
    else if(action == 'addvertical'){
      if( grandParent.hasClass( 'rowParent' )){
        $(grandParent).append( insertIndentation(indentCount) + '<div id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '"></div>\n' )
                      .find( 'div' )
                        .addClass( 'flexChild' )
                        .data( 'flexsize', 1 )
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
                      .find( 'div' )
                        .addClass( 'flexChild' )
                        .data( 'flexsize', 1 )
      }
      else {
        alert( 'You need to split horizontally first.')
      }
    }
    
    /*//////////////////////////////////////
    // Open additional options modal
    //////////////////////////////////////*/
    else if(action == 'options'){
      $('#splitControls').remove()
      parentDiv.append( '<div id="optionsModal">' )
      var dimension = grandParent.hasClass( 'columnParent' ) ? 'height' : 'width',
          parentDimension = grandParent.parent().hasClass( 'columnParent' ) ? 'height' : 'width'

      $( '#optionsModal' ).append( '<img src="img/expand.png" id="growDivButton" alt="Expand div" title="Expand div"></img>')
                          .append( '<img src="img/shrink.png" id="shrinkDivButton" alt="Shrink div" title="Shrink div"></img>')
                          .append( '<img id="removeDivButton" src="img/trash.png" alt="Delete div" title="Delete div"></img><br>' )
                          .append( '<input id="dimensionSizeInput" type="text" placeholder="Fixed ' + dimension + '"><br>' )
                          .append( '<button id="enterDimensionButton">Enter</button><br>')

      if (grandParent.attr('id') != 'container'){
        $( '#optionsModal' ).append( '<input id="parentDimensionSizeInput" placeholder="Parent\'s ' + parentDimension + '" type="text">' )
                            .append( '<button id="enterParentDimensionButton">Enter</button><br>')
      }
      
      // Increase flexsize
      $( '#growDivButton' ).on( 'click', function(){
        parentDiv.css({
          'flex-grow': parentDiv.data( 'flexsize' ) + 1
        })
        CSSOverrides[ parentDiv.attr( 'id' ) ] = parentDiv.attr( 'style' )
        $( '#optionsModal' ).remove()
      })
      
      // Decrease flexsize
      $( '#shrinkDivButton' ).on( 'click', function(){
        if (parentDiv.data( 'flexsize' ) >= 1){
          parentDiv.css({
            'flex-grow': parentDiv.data( 'flexsize' ) - 1
          })
        }
        CSSOverrides[ parentDiv.attr( 'id' ) ] = parentDiv.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#enterDimensionButton' ).on( 'click', function(){
        parentDiv.css({
          'flex': ' none'
        })
        .css(dimension, $( '#dimensionSizeInput' ).val())
        CSSOverrides[ parentDiv.attr( 'id' ) ] = parentDiv.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#enterParentDimensionButton' ).on( 'click', function(){
        grandParent.css({
          'flex': ' none'
        })
        .css(parentDimension, $( '#parentDimensionSizeInput' ).val())
        CSSOverrides[ grandParent.attr( 'id' ) ] = grandParent.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#removeDivButton' ).on( 'click', function(){
       parentDiv.remove()
       delete CSSOverrides[ parentDiv.attr( 'id' )]
       $( '#optionsModal' ).remove()
      })
    }

    $( '#splitControls' ).remove()
  })
})