import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ReviewsCarousel from '../components/ReviewsCarousel'

const reviewsData = [
  {
    imgUrl: 'https://assets.ccbp.in/frontend/react-js/wade-warren-img.png',
    username: 'Wade Warren',
    companyName: 'Rang',
    description:
      'The most important thing I learnt is that nothing is a failure, but what we learn from that is a rich and rewarding experience.',
  },
  {
    imgUrl: 'https://assets.ccbp.in/frontend/react-js/adrian-williams-img.png',
    username: 'Adrian Williams',
    companyName: 'WheelO',
    description:
      'Coming to Startup School is the best thing that has happened to me. I wish every startup in the country should get this opportunity.',
  },
  {
    imgUrl: 'https://assets.ccbp.in/frontend/react-js/sherry-jhonson-img.png',
    username: 'Sherry Johnson',
    companyName: 'MedX',
    description:
      'I am glad to have such experienced mentors guiding us in every step through out the 4 weeks. I have improved personally and developed many interpersonal skills.',
  },
  {
    imgUrl: 'https://assets.ccbp.in/frontend/react-js/ronald-jones-img.png',
    username: 'Ronald Jones',
    companyName: 'Infinos Tech',
    description:
      'I am really loving the way how mentors are taking care of us, the way they are explaining big theories with lots of case studies and innovative methods.',
  },
]

describe('Reviews App tests', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error')
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled()
  })

  it('Page should consist of HTML heading element with Reviews as text content:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(screen.getByRole('heading', {name: /Reviews/i})).toBeInTheDocument()
  })

  it('Page should consist of HTML button element with testid attribute value as leftArrow:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(screen.getAllByRole('button')[0].getAttribute('testid')).toBe(
      'leftArrow',
    )
  })

  it('Page should consist of HTML button element with testid attribute value as rightArrow:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(screen.getAllByRole('button')[1].getAttribute('testid')).toBe(
      'rightArrow',
    )
  })

  it('Page should consist of HTML image element with src attribute and value as path for left arrow image:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(screen.getAllByRole('img')[0].src).toContain(
      'https://assets.ccbp.in/frontend/react-js/left-arrow-img.png',
    )
  })

  it('Page should consist of HTML image element with src attribute and value as path for right arrow image:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(screen.getAllByRole('img')[2].src).toContain(
      'https://assets.ccbp.in/frontend/react-js/right-arrow-img.png',
    )
  })

  it('Page should consist of HTML image element with alt text as <username>-avatar:::5:::', () => {
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    expect(
      screen.getByRole('img', {name: 'Wade Warren-avatar'}),
    ).toBeInTheDocument()
  })

  it('Page should consist of HTML image element with src attribute and value as path for profile image:::5:::', () => {
    const {imgUrl} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    const profileImage = screen.getByRole('img', {name: /-avatar$/})
    expect(profileImage.src.includes(imgUrl.substr(2))).toBe(true)
  })

  it('Page should consist of HTML main heading element with username as text content:::5:::', () => {
    const {username} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    const usernameEl = screen.getByText(username, {exact: false})
    expect(usernameEl.tagName).toBe('P')
  })

  it('Page should consist of HTML paragraph element with company name as text content:::5:::', () => {
    const {companyName} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    const companyNameEl = screen.getByText(companyName, {exact: false})
    expect(companyNameEl.tagName).toBe('P')
  })

  it('Page should consist of HTML paragraph element with review description as text content:::5:::', () => {
    const {description} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    const descriptionEl = screen.getByText(description, {exact: false})
    expect(descriptionEl.tagName).toBe('P')
  })

  it('When the right arrow is clicked, the user avatar of the next review should be displayed:::5:::', () => {
    const {imgUrl} = reviewsData[1]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    userEvent.click(screen.getByTestId('rightArrow'))
    const imageEl = screen.getByRole('img', {name: /-avatar$/})
    expect(imageEl.src.includes(imgUrl.substr(2))).toBe(true)
  })

  it('When the right arrow is clicked, username, company name, and review description of the next review should be displayed:::5:::', () => {
    const {username, companyName, description} = reviewsData[1]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    userEvent.click(screen.getByTestId('rightArrow'))
    expect(screen.getByText(username)).toBeInTheDocument()
    expect(screen.getByText(companyName)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('When the left arrow is clicked, the user avatar of the previous review should be displayed:::5:::', () => {
    const {imgUrl} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    userEvent.click(screen.getByTestId('rightArrow'))
    userEvent.click(screen.getByTestId('leftArrow'))
    const imageEl = screen.getByRole('img', {name: /-avatar$/})
    expect(imageEl.src.includes(imgUrl.substr(2))).toBe(true)
  })

  it('When the left arrow is clicked, username, company name, and review description of the previous review should be displayed:::5:::', () => {
    const {username, companyName, description} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    userEvent.click(screen.getByTestId('rightArrow'))
    userEvent.click(screen.getByTestId('leftArrow'))
    expect(screen.getByText(username)).toBeInTheDocument()
    expect(screen.getByText(companyName)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('When viewing the first review, there should not be any state change when the HTML button element with testid attribute value as leftArrow is clicked:::5:::', () => {
    const {username, companyName, description, imgUrl} = reviewsData[0]
    render(<ReviewsCarousel reviewsData={reviewsData} />)
    userEvent.click(screen.getByTestId('leftArrow'))
    const imageEl = screen.getByRole('img', {name: /-avatar$/})
    expect(imageEl.src.includes(imgUrl.substr(2))).toBe(true)
    expect(screen.getByText(username)).toBeInTheDocument()
    expect(screen.getByText(companyName)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('When viewing the last review, there should not be any state change when the HTML button element with testid attribute value as rightArrow is clicked:::5:::', () => {
    const {username, companyName, description, imgUrl} = reviewsData[1]
    render(<ReviewsCarousel reviewsData={[reviewsData[0], reviewsData[1]]} />)
    userEvent.click(screen.getByTestId('rightArrow'))
    const imageEl = screen.getByRole('img', {name: /-avatar$/})
    expect(imageEl.src.includes(imgUrl.substr(2))).toBe(true)
    expect(screen.getByText(username)).toBeInTheDocument()
    expect(screen.getByText(companyName)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })
})
