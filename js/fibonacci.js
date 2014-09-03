$(document).ready( function(){

  var CSSOverrides = {}

  $( '#triggerHTMLCode' ).on( 'click', function(){
    if( $(this).css('opacity') == 1 ){
      $( '#codeExportTextarea' ).css( 'display', 'none' )
      $(this).css( 'opacity', 0.6)
    }
    else {
      $( 'img' ).css( 'opacity', 0.6)
      $(this).css( 'opacity', 1)
      var code = $('#container')[0].outerHTML.toString()
      $( '#codeExportTextarea' ).css('display', 'block').val( code )
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
      $.get( 'css/fibonacci.css' ).then(function(cssCode, status, xhr){
        var overrides = ''
        for (var i = Object.keys(CSSOverrides).length - 1; i >= 0; i--) {
          overrides += '#' + Object.keys(CSSOverrides)[i] + '{ ' + CSSOverrides[Object.keys(CSSOverrides)[i]] + '}\n'
        }
        $( '#codeExportTextarea' ).css('display', 'block').val( cssCode + '\n\n' + overrides )
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
      'Fibonacci is an offshoot of an internal tool created to let non-developers design page layouts using Flexbox, without having to learn HTML or CSS. \n\n' +
      'Fibonacci starts with a blank <section>, which you can then split to your heart\'s content. It generates both the HTML and CSS needed to recreate the layout in your own pages.\n' +
      'After you\'ve made your horizontal or vertical split, you can then add a new sibling, shrink or expand, give it a fixed width/height, remove or split it again.' +
      'Remember to add a unit when you enter a fixed width or height!\n' +
      'Once you\'re happy with the layout, hit the export icons to copy the generated code and paste it wherever you need it in your own code. \n\n' +
      'Tiny sidenote: Fibonacci is mostly a little sideproject and by no means perfect or bug free. Contributions are highly welcome :)\n\n'+
      'Fibonacci does *not* use the Fibonacci sequence in any way, despite reports to the contrary. The reasoning behind the name  is simple. While testing the tool, I divided the main container into a Fibonacci-esque structure. That\'s it. The structured reminded me of Fibonacci, I liked the ring of it, I called the tool Fibonacci. The End.'


      $( '#codeExportTextarea' ).css('display', 'block').val( code )
    }
  })

  function addSplitControls(srcSection){
    var parent = $(srcSection).parent()
    if( $( '#splitControls' ).length == 0 && $( '#optionsModal' ).length == 0){
      $( srcSection ).append( '<div id="splitControls">' )
      $( '#splitControls' ).append( '<img id="splitVerticalIcon" data-layout-action="splitvertical" src="img/splitvertical.png" alt="Split vertically">' )
      $( '#splitControls' ).append( '<img id="splitHorizontalIcon" data-layout-action="splithorizontal" src="img/splithorizontal.png" alt="Split horizontally" title="Split horizontally">' )

      if( parent.hasClass( 'columnParent' ))
        $( '#splitControls' ).append( '<img id="addHorizontalIcon" data-layout-action="addhorizontal" src="img/addhorizontal.png" alt="Add horizontal sibling" title="Add horizontal sibling">' )

      if( parent.hasClass( 'rowParent' ))
        $( '#splitControls' ).append( '<img id="addVerticalIcon" data-layout-action="addvertical" src="img/addvertical.png" alt="Add vertical sibling" title="Add vertical sibling">' )

      if ( srcSection.id != 'container' )
        $( '#splitControls' ).append( '<img id="addHorizontalIcon" data-layout-action="options" src="img/options.png" alt="More options" title="More options">' )

    }
  }

  $( 'body' ).on( 'mouseover', 'section', function(e){
    addSplitControls(this)
  })

  $( 'body' ).on( 'mouseleave', 'section', function(e){
    e.stopPropagation()
    $('#splitControls').remove()
    $('#optionsModal').remove()
  })

  $( 'body' ).on( 'click', '#splitControls img', function(){
    var parentSection = $(this).parent().parent()
    var grandParent = parentSection.parent()
    var action = $(this).data('layout-action')

    /*//////////////////////////////////////
    // Split current row in two
    //////////////////////////////////////*/
    if (action == 'splitvertical'){
      parentSection.append( '\n<section id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
      parentSection.append( '\n<section id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
      $(parentSection).addClass( 'rowParent' )
      $(parentSection).find( 'section' )
        .addClass( 'flexChild' )
        .data( 'flexsize', 1 )
    }

    /*//////////////////////////////////////
    // Split current column in two
    //////////////////////////////////////*/
    else if (action == 'splithorizontal'){
      parentSection.append( '\n<section id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
      parentSection.append( '\n<section id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
      $(parentSection).addClass( 'columnParent' )
      $(parentSection).find( 'section' )
        .addClass( 'flexChild' )
        .data( 'flexsize', 1 )
    }

    /*//////////////////////////////////////
    // Add extra row
    //////////////////////////////////////*/
    else if(action == 'addvertical'){
      if( grandParent.hasClass( 'rowParent' )){
        $(grandParent).append( '\n<section id="rowChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
        $(grandParent).find( 'section' ).addClass( 'flexChild' )
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
        $(grandParent).append( '\n<section id="columnChild' + Math.floor(Math.random() * 100000 + 1) + '">' )
        $(grandParent).find( 'section' ).addClass( 'flexChild' )
      }
      else {
        alert( 'You need to split horizontally first.')
      }
    }

    else if(action == 'options'){
      $('#splitControls').remove()
      parentSection.append( '<div id="optionsModal">' )
      var dimension = grandParent.hasClass( 'columnParent' ) ? 'height' : 'width'
      var parentDimension = grandParent.parent().hasClass( 'columnParent' ) ? 'height' : 'width'


      $( '#optionsModal' ).append( '<img src="img/expand.png" id="growSectionButton" alt="Expand section" title="Expand section"></img>')
                          .append( '<img src="img/shrink.png" id="shrinkSectionButton" alt="Shrink section" title="Shrink section"></img>')
                          .append( '<img id="removeSectionButton" src="img/trash.png" alt="Delete section" title="Delete section"></img><br>' )
                          .append( '<input id="dimensionSizeInput" type="text" placeholder="Fixed ' + dimension + '"><br>' )
                          .append( '<button id="enterDimensionButton">Enter</button><br>')

      if (grandParent.attr('id') != 'container'){
        $( '#optionsModal' ).append( '<input id="parentDimensionSizeInput" placeholder="Parent\'s ' + parentDimension + '" type="text">' )
                            .append( '<button id="enterParentDimensionButton">Enter</button><br>')
      }

      $( '#growSectionButton' ).on( 'click', function(){
        parentSection.css({
          'flex-grow': parentSection.data( 'flexsize' ) + 1
        })
        CSSOverrides[ parentSection.attr( 'id' ) ] = parentSection.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#shrinkSectionButton' ).on( 'click', function(){
        if (parentSection.data( 'flexsize' ) <= 2){
          parentSection.css({
            'flex-grow': parentSection.data( 'flexsize' ) - 1
          })
        }
        CSSOverrides[ parentSection.attr( 'id' ) ] = parentSection.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#enterDimensionButton' ).on( 'click', function(){
        parentSection.css({
          'flex': ' none',
        })
        .css(dimension, $( '#dimensionSizeInput' ).val())
        CSSOverrides[ parentSection.attr( 'id' ) ] = parentSection.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#enterParentDimensionButton' ).on( 'click', function(){
        grandParent.css({
          'flex': ' none',
        })
        .css(parentDimension, $( '#parentDimensionSizeInput' ).val())
        CSSOverrides[ parentSection.attr( 'id' ) ] = parentSection.attr( 'style' )
        $( '#optionsModal' ).remove()
      })

      $( '#removeSectionButton' ).on( 'click', function(){
       parentSection.remove()
       delete CSSOverrides[ parentSection.attr( 'id' )]
       $( '#optionsModal' ).remove()
      })
    }

    $( '#splitControls' ).remove()
  })


})
