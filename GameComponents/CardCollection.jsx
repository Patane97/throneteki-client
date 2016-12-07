import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';

class CardCollection extends React.Component {
    constructor() {
        super();

        this.onCollectionClick = this.onCollectionClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onTopCardClick = this.onTopCardClick.bind(this);

        this.state = {
            showPopup: false
        };
    }

    onCollectionClick(event) {
        event.preventDefault();
        
        this.setState({showPopup: !this.state.showPopup});
    }

    onTopCardClick() {
        this.setState({showPopup: !this.state.showPopup});
    }

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');

        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = JSON.parse(card);

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    getPopup() {
        var popup = null;

        if(this.state.showPopup) {
            var cardList = _.map(this.props.cards, card => {
                return (<Card key={card.uuid} card={card} source={this.props.source}
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            var popupClass = 'popup panel';

            if(this.props.popupLocation === 'top') {
                popupClass += ' our-side';
            }

            popup = (
                <div className={popupClass} onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCollectionClick}>Close</a>
                    </div>
                    <div className='inner'>
                        {cardList}
                    </div>
                </div>);
        }

        return popup;
    }

    render() {
        var className = 'panel ' + this.props.className;
        var headerText = this.props.title + ' (' + this.props.cards.length + ')';
        var topCard = this.props.topCard || _.last(this.props.cards);
        return (
            <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={event => this.onDragDrop(event, this.props.source)}
                    onClick={this.onCollectionClick}>
                <div className='panel-header'>
                    {headerText}
                </div>
                {topCard ? <Card card={topCard} source={this.props.source}
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut}
                         disableMouseOver={topCard.facedown}
                         onClick={this.onTopCardClick}
                         horizontal={this.props.orientation === 'horizontal'} /> : null}
                {this.getPopup()}
            </div>);
    }
}

CardCollection.displayName = 'CardCollection';
CardCollection.propTypes = {
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    orientation: React.PropTypes.string,
    popupLocation: React.PropTypes.string,
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'revealed plots', 'selected plot', 'attachment']).isRequired,
    title: React.PropTypes.string,
    topCard: React.PropTypes.object
};

export default CardCollection;
